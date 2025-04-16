const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./authRouter');
const roleRouter = require('./roleRouter');
const eventsourceRouter = require('./eventsourceRouter');


const PORT = process.env.PORT || 5000;
const MONGODB_URL =
    process.env.MONGODB_URL
    || 'mongodb://192.168.1.212:27017/';

const app = express();

app.use(cors())
    .use(express.json())
    .use('/auth', authRouter)
    .use('/roles', roleRouter)
    .use('/chat', eventsourceRouter);

const start = () => {
    mongoose.connect(MONGODB_URL)
        .then(() =>
            app.listen(PORT, () => {
                console.log('server start on %d port', PORT);
            })
        );
};

start();
