const mongoose = require('mongoose');
const schema = mongoose.Schema({ 
    width: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    },
    checksum: {
        type: String,
        required: true
    },
    taskId: {
        type: String,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('Image', schema);