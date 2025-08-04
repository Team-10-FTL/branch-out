require('dotenv').config();
const { fetchReposWithFilters } = require("../helpers/githubHelper");
const { parseRepoForGemini } = require("../helpers/repoParseHelper");
const { analyzeRepoWithGemini } = require("../src/utils/geminiClient");
const axios = require('axios');
const prisma = require("../models/prismaClient");
const cron = require('node-cron');

// skill level enum adjusted for UI
const DIFFICULTY_ENUM = {
    Beginner: "FIRSTYEAR",
    Intermediate: "SECONDYEAR",
    Advanced: "THIRDYEAR",
    Professional: "FOURTHYEAR",
};

const AVAILABLE_TAGS = [
    "Full-Stack Web Development",
    "Frontend Web Development",
    "Backend Web Development",
    "Mobile Development Kotlin",
    "Mobile Development Swift",
    "Operating Systems",
    "Machine Learning/NLP",
    "Game Development",
    "AI",
    "DSA",
    "Data Science (or Big Data)",
    "Internet of Things",
    "Cybersecurity",
    "Information Technology",
    "Model Context Protocol",
    "Hardware",
    "Cloud Computing",
    "AR/VR Development",
    "Block Chain/NFT",
    "Compiler Design",
    "DevOps, CI/CD",
];

const repoFetcher = async () => {
    console.log('Starting repo fetcher...');
    
    try {
        // Get last pulled information (you should store this in DB or config)
        const lastPulled = '2010-01-01'; // Use a more recent date
        const currentDate = new Date().toISOString().slice(0, 10);
        
        console.log(`Fetching repos from ${lastPulled} to ${currentDate}`);

        // Fetch repos from github (call the github helper)
        console.log('🔍 Fetching repos from GitHub...');
        const repos = await fetchReposWithFilters({ 
            startDate: lastPulled, 
            endDate: currentDate 
        });
        
        console.log(`Found ${repos.length} repos from GitHub`);
        
        if (repos.length === 0) {
            console.log('No repos found from GitHub API');
            return;
        }

        // Get existing repos to avoid duplicates
        console.log('Checking for existing repos in database...');
        const existingRepos = await prisma.repo.findMany({
            select: {
                githubId: true,
            }
        });
        
        console.log(`Found ${existingRepos.length} existing repos in database`);

        // Filter out existing repos
        const filteredRepos = repos.filter(repo => {
            return !existingRepos.some(existingRepo => existingRepo.githubId === repo.id);
        });
        
        console.log(`${filteredRepos.length} new repos to process after filtering`);
        
        if (filteredRepos.length === 0) {
            console.log('ℹNo new repos to add');
            return;
        }

        // Limit to avoid overwhelming the system
        const limitedRepos = filteredRepos.slice(0, 30); // Start with fewer repos
        console.log(`Processing ${limitedRepos.length} repos`);
        
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < limitedRepos.length; i++) {
            const repo = limitedRepos[i];
            
            try {
                console.log(`\nProcessing repo ${i + 1}/${limitedRepos.length}: ${repo.name}`);
                
                // Get Gemini enriched data 
                console.log('Analyzing with Gemini...');
                const geminiOutput = await analyzeRepoWithGemini(repo, AVAILABLE_TAGS, DIFFICULTY_ENUM);
                
                console.log('Saving to database...');
                await prisma.repo.create({
                    data: {
                        owner: geminiOutput.owner,
                        name: geminiOutput.name,
                        stars: geminiOutput.stars,
                        languages: geminiOutput.languages || [],
                        tags: geminiOutput.tags || [],
                        topics: geminiOutput.topics || [],
                        skill: geminiOutput.skill || [],
                        summaryTitle: geminiOutput.summaryTitle || "",
                        summary: geminiOutput.summary || "",
                        description: geminiOutput.description || "",
                        githubId: geminiOutput.githubId,
                        repoLink: geminiOutput.repoLink,
                    }
                });
                
                successCount++;
                console.log(`Successfully inserted repo: ${geminiOutput.name}`);
                
                // Add a small delay to avoid overwhelming APIs
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (repoError) {
                errorCount++;
                console.error(`Error processing repo ${repo.name}:`, repoError.message);
                console.error('Stack trace:', repoError.stack);
                
                // Continue with next repo instead of stopping
                continue;
            }
        }
        
        console.log(`\nSummary: ${successCount} successful, ${errorCount} errors`);
        
    } catch (error) {
        console.error('Fatal error in repoFetcher:', error.message);
        console.error('Stack trace:', error.stack);
        throw error; // Re-throw to see the full error
    } finally {
        // Always disconnect Prisma
        await prisma.$disconnect();
        console.log('Prisma disconnected');
    }
};

function logMessage() {
    console.log('Cron job executed at:', new Date().toLocaleString());
}

// Wrap the execution to catch any unhandled errors
const runRepoFetcher = async () => {
    try {
        await repoFetcher();
        console.log('Repo fetcher completed successfully');
    } catch (error) {
        console.error('Repo fetcher failed:', error);
        process.exit(1); // Exit with error code
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Run immediately for testing
console.log('Starting manual execution...');
runRepoFetcher();

// Uncomment to enable scheduled execution
cron.schedule('0 * * * *', () => { // Run every 1 hours instead of every hour
    console.log('\nStarting scheduled repo fetch...');
    logMessage();
    runRepoFetcher();
});