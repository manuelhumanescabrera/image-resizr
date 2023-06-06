const Task = require('../../model/task.model');
const TaskStatus = require('../../constants/task.constants');

const createTask = async(req, res, next) => {
    const task = new Task({status: TaskStatus.PROCCESSING, originalImage: req.file.path})
    try {
        await task.save();
        res.status(200).json(task.doc)
    }
    catch(ex) {
        console.error('Error creating task in database', { ex });
        res.status(500).json({ error: ex.message })
    }
    next();
}
const getTaskDetail = async(req, res, next) => {
    res.json({
        status: 'success'
    })
    next();
}

module.exports = {
    createTask,
    getTaskDetail
}