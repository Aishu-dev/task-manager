const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const router = new express.Router();

/* create user */
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
});

/*login user */
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

/*logout user*/
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
});

/*upload profile picture */

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) { // cb stands for callback
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

/*upload profile picture */
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

/*delete profile picture */

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
});

/* getting avatar */

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

/* logoutall user */

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

/* read users */
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

/*update user */
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
        res.send(req.user);

    } catch (e) {
        res.status(500).send(e);
    }
});

/* delete user */
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        console.log('eeeeeeeeeeeeee', e)
        res.status(500).send();
    }
});

module.exports = router;