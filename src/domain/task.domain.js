const Task = require('../model/task.model');
const TaskStatus = require('../constants/task.constants');
const imageService = require('../services/image.service');
const fs = require('fs-extra');
const FormData = require('form-data');
const form = new FormData();
const fetch = require('node-fetch');

const createTask = async (file) => {
    const { path, originalname } = file;
    const task = new Task({status: TaskStatus.PROCCESSING, originalImage: path})
    try {
        await task.save();
    }
    catch(error) {
        throw new Error('Error creating task in database', { error: error.message })
    }

    const imagePath = await imageService.createImage(task.id, path, originalname.split('.')[0]);
    
    return _dispatchResizeImage(task.id, imagePath);
}

const _dispatchResizeImage = (taskId, imagePath) => {
    form.append('file', fs.createReadStream(imagePath))
    form.append('taskId', taskId);

    return fetch('https://us-central1-kds-pruebastec.cloudfunctions.net/image-resizr-2', { method: 'POST', body: form }).catch(async (err) => {
        await Task.findByIdAndUpdate(taskId, { status: TaskStatus.ERROR}).catch((error) => {
            throw new Error('Error updating task status to error', { error: error.message })
        });
        throw new Error('Error dispatching google cloud function', { error: err.message });        
    });    
}

module.exports = {
    createTask
}