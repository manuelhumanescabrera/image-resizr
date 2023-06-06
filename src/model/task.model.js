const mongoose = require('mongoose');
const TaskStatus = require('../constants/task.constants');
const schema = mongoose.Schema({ 
    status: {
        type: String,
        enum: [TaskStatus.PROCCESSING, TaskStatus.ERROR, TaskStatus.SUCCESS],
        required: true
    }, 
    originalImage: {
        type: String,
        required: true
    } 
}, { timestamps: true });
module.exports = mongoose.model('Task', schema);