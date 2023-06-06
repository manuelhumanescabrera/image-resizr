const router = require('express').Router();
const taskController = require('./controllers/task.controller');
const multer = require('multer');
const fs = require('fs-extra');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if(file.fieldname === 'image') {
                const path = './output/original';
                fs.mkdirsSync(path);
                cb(null, path);
            }
            else {
                const path = `./output/${file.fieldname}`;
                fs.mkdirSync(path)
                cb(null, path);
            }
        },
        limits: { fileSize: 10 * 1024 * 1024 },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});

router.post('/', upload.single('image'), taskController.createTask)
router.get('/:id', taskController.getTaskDetail)
 
module.exports = router;