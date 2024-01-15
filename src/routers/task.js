const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();


/* create task */
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);

    } catch (e) {
        res.status(400).send(e);
    }
});

/* read all tasks */
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {

        const tasks = await Task.find({ owner: req.user._id, ...match }).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort);

        // await req.user.populate({
        //     path: 'tasks',
        //     match,
        //     options: {
        //         limit: 2
        //     }
        // }).execPopulate();

        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* read task by id*/
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id);

        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        return res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* update task */
router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        // const task = await Task.findById(req.params.id);

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);

        await task.save();

        return res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

/* delete task*/

router.delete('/tasks/:id', auth, async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        // const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        return res.send(task);

    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;