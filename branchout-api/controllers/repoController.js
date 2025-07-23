const prisma = require("../models/prismaClient");

// Helper: emit event if io is available
function emitEvent(req, event, data) {
    if (req.io) {
        req.io.emit(event, data);
    }
}

// Get all repos (admin only)
exports.getAllRepos = async (req, res) => {
    try {
        const repos = await prisma.repo.findMany({
            select: {
                id: true, owner: true, name: true, stars: true, languages: true,
                tags: true, topics: true, skill: true, summary: true,
                description: true, savedBy: true, githubId: true, feedBack: true, repoLink: true,
            }
        });
        res.status(200).json(repos);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching repos!");
    }
};

// Get a specific repo by id
exports.getByID = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = await prisma.repo.findUnique({
            where: { id },
            select: {
                id: true, owner: true, name: true, stars: true, languages: true,
                tags: true, topics: true, skill: true, summary: true,
                description: true, savedBy: true, githubId: true, feedBack: true, repoLink: true,
            },
        });
        if (!repo) {
            return res.status(404).json({ error: "Repo not found!" });
        }
        res.status(200).json(repo);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error fetching repo");
    }
};

// Create new repo
exports.create = async (req, res) => {
    try {
        const {
            owner, name, stars, languages, tags, topics, skill, summary,
            description, savedBy, githubId, feedBack, repoLink
        } = req.body;

        const data = {
            owner, name, stars, languages, tags, topics, skill, summary,
            description, savedBy, githubId, feedBack, repoLink
        };

        const newRepo = await prisma.repo.create({ data });
        emitEvent(req, "repoCreated", newRepo); // WebSocket event
        res.status(201).json(newRepo);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Error creating repo!" });
    }
};

// Update repo
exports.update = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updatedRepo = await prisma.repo.update({
            where: { id },
            data: req.body,
        });
        emitEvent(req, "repoUpdated", updatedRepo); // WebSocket event
        res.json(updatedRepo);
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ error: "Error updating repo information!" });
    }
};

// Delete repo
exports.delete = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.repo.delete({ where: { id } });
        emitEvent(req, "repoDeleted", { id }); // WebSocket event
        res.status(204).end();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error deleting repo!" });
    }
};

// Filter repos by user preferences
exports.filterRepos = async (req, res) => {
    try {
        const { level, languages, tags } = req.query;
        const filter = {};
        if (level) filter.skill = { hasSome: level.split(',') };
        if (languages) filter.languages = { hasSome: languages.split(',') };
        if (tags) filter.tags = { hasSome: tags.split(',') };

        const filteredRepos = await prisma.repo.findMany({
            where: filter,
            select: {
                id: true, owner: true, name: true, stars: true, languages: true,
                tags: true, topics: true, skill: true, summary: true,
                description: true, savedBy: true, githubId: true, feedBack: true, repoLink: true,
            },
        });

        res.status(200).json(filteredRepos);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error filtering repos!!");
    }
};

// Handle swipe/feedback
exports.handleSwipe = async (req, res) => {
    const { userId, repoId, direction, feedbackReason } = req.body;

    if (!userId || !repoId || !direction) {
        return res.status(400).json({ error: "Missing required fields!!" });
    }

    try {
        const feedback = await prisma.feedBack.create({
            data: {
                swipeDirection: direction,
                feedbackReason: feedbackReason ?? null,
                user: { connect: { id: userId } },
                repo: { connect: { id: repoId } },
            },
        });

        if (direction === "RIGHT") {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    savedRepos: { connect: { id: repoId } },
                },
            });
        }
        emitEvent(req, "feedbackCreated", feedback); // WebSocket event
        res.status(201).json({ message: "Swipe Stored", feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Failed to handle swipe :(" });
    }
};