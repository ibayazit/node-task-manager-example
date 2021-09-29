const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

// Get Tasks
const getTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({})
    res.status(200).json({ tasks })
})

// Create Task
const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create(req.body)
    res.status(201).json({ task })
})

// Get Task
const getTask = asyncWrapper(async (req, res, next) => {
    const { id: taskId } = req.params
    const task = await Task.findById(taskId)

    if (!task)
        return next(createCustomError(`Not task with id: ${taskId}`, 404))

    res.status(200).json({ task })
})

// Update Task
const updateTask = asyncWrapper(async (req, res, next) => {
    const { id: taskId } = req.params
    const task = await Task.findByIdAndUpdate(taskId, req.body, {
        new: true,
        runValidators: true
    })

    if (!task)
        return next(createCustomError(`Not task with id: ${taskId}`, 404))

    res.status(200).json({ task })
})

// Delete Task
const deleteTask = asyncWrapper(async (req, res, next) => {
    const { id: taskId } = req.params
    const task = await Task.findByIdAndDelete(taskId)

    if (!task)
        return next(createCustomError(`Not task with id: ${taskId}`, 404))

    res.status(200).json({ task })
})

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
}