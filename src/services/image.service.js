const Image = require('../model/image.model');
const imageSize = require('image-size');
const crypto = require("crypto");
const fs = require('fs-extra');

const VALIDS_RESIZED_WIDTH = [1024,800];

const createImage = async (taskId, imagePath, originalFileName) => {
    try {
        const { width, height, type } = imageSize(imagePath);
        const checksum = crypto.createHash('md5').update(imagePath).digest('hex');
        const newImagePath = await _copyAndRenameFile({imagePath, originalFileName, checksum, width, type});
        const image = new Image({width: width, height: height, image: newImagePath, checksum, taskId})
        await image.save();
        return newImagePath;
    }
    catch(error) {
        throw new Error('Error creating image', { error: error.message })
    }
};

const _copyAndRenameFile = async ({imagePath, originalFileName, checksum, width, type}) => {
    const newImagePath = await _generateNewImagePath(originalFileName, checksum, width, type);

    fs.moveSync(imagePath, newImagePath, { overwrite: true })
    fs.removeSync(imagePath);

    return newImagePath;
}

const _generateNewImagePath = async (originalFilename, checksum, width, type) => {
    let newImagePath = '';
    if(VALIDS_RESIZED_WIDTH.includes(width)) {
        newImagePath = `./output/${originalFilename}/${width}/${checksum}.${type}`;
        await fs.ensureDir(`./output/${originalFilename}/${width}`);

    }
    else {
        newImagePath = `./output/${originalFilename}/original/${checksum}.${type}`;
        await fs.ensureDir(`./output/${originalFilename}/original`);
    }
    return newImagePath;
}

module.exports = {
    createImage
}