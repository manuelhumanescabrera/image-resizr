const domain = require('../../domain/task.domain');

const createTask = async(req, res, next) => {
    try {
        await domain.createTask(req.file);
        res.status(201).send();
    }
    catch(ex) {
        console.error('Error creating task in database', { ex });
        res.status(500).json({ error: ex.message })
    }
    next();
}
const getTaskDetail = async(req, res, next) => {
    try {
        const status = await domain.getTaskStatus(req.params.id);
        if(status === null ) res.status(404).send();
        res.status(200).json({ status })
    }
    catch(ex) {
        console.error('Error getting task detail', { ex });
        res.status(500).json({ error: ex.message })
    }
    next();
}
const generatedImages = async(req, res, next) => {
    try {
        await domain.generatedImages(req.body.taskId, req.files);
        res.status(201).send();
    }
    catch(ex) {
        console.error('Error generating resized images', { ex });
        res.status(500).json({ error: ex.message })
    }
    next();
}

module.exports = {
    createTask,
    getTaskDetail,
    generatedImages
}