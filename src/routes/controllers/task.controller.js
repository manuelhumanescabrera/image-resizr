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

module.exports = {
    createTask
}