const router = require('express').Router();

const taskRouter = require('./task.route');
 
//Raiz
router.use('/task', taskRouter)
 
module.exports = router;