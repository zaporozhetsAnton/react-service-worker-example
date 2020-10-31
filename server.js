const express = require('express');
const webpush = require('web-push');
const cors = require('cors');

const publicVapidKey = 'BPjl1X5c76RjGD4vqeJj4tXznvKjDvkJ7LR0rDXCH6leqvOT6mRo60V2MKBshSQKx5HhfwTnLD-gSHHVoXjHfns';
const privateVapidKey = 'Gfgz0KhcdwZIgf3tlwecUo8_ECjzKwJ-HBfyZUSZZt0';

webpush.setVapidDetails('mailto:zaporozhetsanton@gmail.com', publicVapidKey, privateVapidKey);

const app = express();

app.use(cors());

app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'test' });

    console.log(subscription);

    webpush.sendNotification(subscription, payload).catch((error) => {
        console.error(error.stack);
    });
});

app.listen(3000, () => console.log('server url http://localhost:3000'));
