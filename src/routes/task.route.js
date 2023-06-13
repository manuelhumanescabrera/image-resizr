const router = require('express').Router();
const taskController = require('./controllers/task.controller');
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: '/tmp',
        limits: { fileSize: 10 * 1024 * 1024 },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});

router.post('/', upload.single('image'), taskController.createTask)
router.route('/:id')
    .get(taskController.getTaskDetail) 
router.post('/resized-images', upload.array('images', 2), taskController.generatedImages)
module.exports = router;