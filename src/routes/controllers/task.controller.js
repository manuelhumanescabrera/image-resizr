const createTask = async(req, res, next) => {
    res.json({
        file: {...req.file}
    })
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