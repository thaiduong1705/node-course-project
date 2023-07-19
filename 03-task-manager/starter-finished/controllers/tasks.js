const Task = require("../models/Task");
const asyncWrapper = require("../middlewares/async");
const { createCustomError } = require("../error/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({});
    res.status(200).json({ tasks, amount: tasks.length });
});

const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create(req.body);
    res.status(201).json(task);
});

const getSingleTask = asyncWrapper(async (req, res, next) => {
    const { id: taskId } = req.params;
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
        return next(createCustomError(`No task with id: ${taskId}`, 404));
    }
    res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
    const { id: taskId } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskId });
    if (!task) {
        return next(createCustomError(`No task with id: ${taskId}`, 404));
    }
    res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req, res) => {
    const { id: taskId } = req.params;
    const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!task) {
        return next(createCustomError(`No task with id: ${taskId}`, 404));
    }
    res.status(200).json({ task });
});

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask,
};
