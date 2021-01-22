const { Router } = require('express');
const router = Router();

const User = require('../models/user');

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => res.send('Hello World'))


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({email, password});
    await newUser.save();

    const token = jwt.sign({_id: newUser._id }, 'secretKey')
    res.status(200).json({token});
})

router.post('/signin', async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({email: email})
    if (!user) return res.status(401).send('The email doesn´t exist');
    if (user.password !== password) return res.status(401).send('Wrong password');

    const token = jwt.sign({_id: user._id}, 'secretKey');
    return res.status(200).json({token});


});

router.get('/tasks', (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'lorem ipsun',
            date: '2021-01-15T22:55:33.047Z'
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsun',
            date: '2021-01-15T22:55:33.047Z'
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsun',
            date: '2021-01-15T22:55:33.047Z'
        }
    ])
});

router.get('/private-tasks', verifyToken, (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'lorem ipsun',
            date: '2021-01-15T22:55:33.047Z'
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsun',
            date: '2021-01-15T22:55:33.047Z'
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsun',
            date: '2021-01-15T22:55:33.047Z'
        }

    ])
});


module.exports = router;

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }

    const token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    }

    const payload = jwt.verify(token, 'secretKey')
    req.userId = payload._id
    next();



}