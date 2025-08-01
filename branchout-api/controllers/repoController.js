const prisma = require("../models/prismaClient");

// bare /repo routes like those on this file should be usable by ADMINS only, repos that are user specific should be stored/posted/fetched from the user endpoints

// get all repos (DONt ACTUALLY NEED THIS) bc its thousands of repos assuming we do the cron job
exports.getAllRepos = async (req, res) => {
    try {
        // end point protected by middleware, user is admin so can access
        const repos = await prisma.repo.findMany({
            select: {
                id: true, 
                owner: true,
                name: true,
                stars: true,
                languages: true,
                tags: true, // AI generated tags
                topics: true, // pulled from github API
                skill: true, // AI assigned level
                summary: true, // AI generates summary
                description: true,
                savedBy: true, // relation to user
                githubId: true,
                feedBack: true,
                repoLink: true,
            }
        });
        res.status(200).json({ repositories: repos });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching repos!")
    }
};

exports.getAllLanguages = async (req, res) => {
    try {
        const repos = await prisma.repo.findMany({
            select: { languages: true },
        });
        const uniqueLanguages = [...new Set(repos.flatMap(repo => repo.languages))];

        // Return in the format your frontend expects
        res.status(200).json({ languages: uniqueLanguages });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching languages!");
    }
}

exports.getAllOwners = async (req, res) => {
    try {
        const repos = await prisma.repo.findMany({
            select: { owner: true },
        });
        const uniqueOwners = [...new Set(repos.map(repo => repo.owner))];
        
        // Return in the format your frontend expects
        res.status(200).json({ owners: uniqueOwners });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching owners!");
    }
}

exports.getAllTags = async (req, res) => {
    try {
        const repos = await prisma.repo.findMany({
            select: { tags: true },
        });
        const uniqueTags = [...new Set(repos.flatMap(repo => repo.tags))];
        
        // Return in the format your frontend expects
        res.status(200).json({ tags: uniqueTags });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching tags!");
    }
}

// get a specific repo by id
exports.getByID = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = await prisma.repo.findUnique({
            where: { id },
            select: {
                id: true, 
                owner: true,
                name: true,
                stars: true,
                languages: true,
                tags: true, 
                topics: true, 
                skill: true, 
                summary: true, 
                description: true,
                savedBy: true, 
                githubId: true,
                feedBack: true,
                repoLink: true,
            },
        });
        if (!repo) {
            return res.status(404).json({error: "Repo not found!"});
        }
        res.status(200).json(repo);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching repo")
    }
};

// NEW: Search/filter repos endpoint
exports.searchRepos = async (req, res) => {
    try {
        const { 
            query, 
            languages, 
            tags, 
            owner, 
            skillLevel, 
            minStars, 
            maxStars 
        } = req.query;

        // Build the filter object based on query parameters
        const filter = {};
        const orConditions = [];

        // Text search in name and description
        if (query) {
            orConditions.push(
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
            );
        }

        // Add OR conditions if they exist
        if (orConditions.length > 0) {
            filter.OR = orConditions;
        }

        // Language filter
        if (languages) {
            filter.languages = { 
                hasSome: languages.split(',').map(lang => lang.trim()) 
            };
        }

        // Tags filter
        if (tags) {
            filter.tags = { 
                hasSome: tags.split(',').map(tag => tag.trim()) 
            };
        }

        // Owner filter
        if (owner) {
            filter.owner = { 
                contains: owner, 
                mode: 'insensitive' 
            };
        }

        // Skill level filter
        if (skillLevel) {
            filter.skill = skillLevel;
        }

        // Stars range filter
        if (minStars || maxStars) {
            filter.stars = {};
            if (minStars) {
                filter.stars.gte = parseInt(minStars);
            }
            if (maxStars) {
                filter.stars.lte = parseInt(maxStars);
            }
        }

        console.log('Search filter:', JSON.stringify(filter, null, 2));

        const repos = await prisma.repo.findMany({
            where: filter,
            select: {
                id: true, 
                owner: true,
                name: true,
                stars: true,
                languages: true,
                tags: true, 
                topics: true, 
                skill: true, 
                summary: true, 
                description: true,
                savedBy: true, 
                githubId: true,
                feedBack: true,
                repoLink: true,
            },
            orderBy: {
                stars: 'desc' // Order by stars descending by default
            }
        });

        res.status(200).json({ repositories: repos });
    } catch (error) {
        console.log('Search error:', error.message);
        res.status(500).json({ error: "Error searching repos!" });
    }
};

// make new repo
exports.create = async (req, res) => {
    try {
        const {owner, name, stars, languages, tags, topics, skill, summary, description, savedBy, githubId, feedBack, repoLink} = req.body;

        // prepare data for prisma create
        const data = {
            owner, 
            name,
            stars,
            languages,
            tags,
            topics,
            skill, 
            summary, 
            description,
            savedBy,
            githubId,
            feedBack, 
            repoLink
        };

        const newRepo = await prisma.repo.create({ data });
        res.status(201).json(newRepo);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error creating repo!" });
    }
}

// update repo 
exports.update = async(req, res) => {
    try{
        const id = Number(req.params.id);
        const updatedRepo = await prisma.repo.update({
            where: {id},
            data: req.body,
        });
        res.json(updatedRepo);
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ error: "Error updating repo information!" });
    }
};

// delete repo
exports.delete = async(req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.repo.delete({
            where: { id },
        });
        res.status(204).end();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error deleting repo!"})
    }
}

// DEPRECATED: Use searchRepos instead
exports.filterRepos = async (req, res) => {
    try {
        const { level, languages, tags } = req.query;
        // Build the filter object based on query parameters
        const filter = {};
        
        if (level) {
            filter.skill = level;
        }
        if (languages) {
            filter.languages = { hasSome: languages.split(',') };
        }
        if (tags) {
            filter.tags = { hasSome: tags.split(',') };
        }

        const filteredRepos = await prisma.repo.findMany({
            where: filter,
            select: {
                id: true, 
                owner: true,
                name: true,
                stars: true,
                languages: true,
                tags: true, 
                topics: true, 
                skill: true, 
                summary: true, 
                description: true,
                savedBy: true, 
                githubId: true,
                feedBack: true,
                repoLink: true,
            },
        });

        res.status(200).json({ repositories: filteredRepos });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error filtering repos!!")
    }
}

// create feedback entry
exports.handleSwipe = async (req, res) => {
    const {userId, repoId, direction, feedbackReason} = req.body;

    if (!userId || !repoId || !direction){
        return res.status(400).json({ error: "Missing required fields!!"});
    }

    try {
        // create the feedback in the first place
        const feedback = await prisma.feedBack.create({
            data: {
                swipeDirection: direction,
                feedbackReason: feedbackReason ?? null,
                user: {connect: {id: userId}},
                repo: {connect: {id: repoId}},
            },
        });

        if (direction === "RIGHT"){
            await prisma.user.update({
                where: {id: userId},
                data: {
                    savedRepos:{
                        connect: {id: repoId},
                    },
                },
            });
        }
        res.status(201).json({message: "Swipe Stored", feedback});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to handle swipe :("});
    }
};