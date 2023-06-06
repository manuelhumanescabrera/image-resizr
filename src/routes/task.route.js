const router = require('express').Router();
const taskController = require('./controllers/task.controller');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads/',
        limits: { fileSize: 10 * 1024 * 1024 },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});
//Raiz
router.post('/', upload.single('image'), taskController.createTask)
router.get('/:id', taskController.getTaskDetail)
 
module.exports = router;