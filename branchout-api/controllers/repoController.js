const prisma = require("../models/prismaClient");


// bare /repo routes like those on this file should be usable by ADMINS only, repos that are user specific should be stored/posted/fetched from the user endpoints

// get all repos (DONt ACTUALLY NEED THIS) bc its thousands of repos assuming we do the cron job
exports.getAllRepos = async (requestAnimationFrame, res) => {
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
        res.status(200).json(repos)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching repos!")
    }
};

// get a specific repo by id
exports.getByID = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = await prisma.repo.findUnique({where: {id},
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
    } catch {
        console.log(error.message);
        res.status(500).send("Error fetching repo")
    }
};

// make new repo
exports.create = async (req, res) => {
    const {owner, name, stars, languages, tags, topics, level, summary, description, savedBy, githubId, feedBack, repoLink} = req.body;

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
    res.status(201).json(newRepo)
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
    } catch {
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

// GET/filter repos by user inputed preferences like level, languages, and tags
exports.filterRepos = async (req, res) => {
    try {
        const { level, languages, tags } = req.query;
        // Build the filter object based on query parameters
        const filter ={};
        if (languages){
            filter.level= {hasSome: level.split(',') };
            filter.languages = {hasSome: languages.split(',') };
            filter.tags = {hasSome: tags.split(',') };

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

            res.status(200).json(filteredRepos);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error filtering repos!!")
    }
}

// create feed back entry

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
        res.status(500).json({err: "Failed to handle swip :("});
    }

};




