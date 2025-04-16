const User = require('./models/User');

const events = require('events');
const Message = require('./models/Message');


const emitter = new events.EventEmitter();



class EventsourceController {
    connect(req, res) {
        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        });
        Promise.resolve().then(() => {
            return Message.find().sort({ timestamp: -1 })
                .limit(30)
                .lean();
        }).then((messages) => {
            console.log(messages);
            messages.reverse()
                .forEach(msg => {
                    res.write(`data: ${JSON.stringify(msg)}\n\n`);
                });
        });

        const onNewMessage = (message) => {
            res.write(`data: ${JSON.stringify(message)} \n\n`);
        };

        emitter.on('newMessage', onNewMessage);

        emitter.on('close', () => {
            emitter.removeListener('newMessage', onNewMessage);
        });
    }

    message(req, res) {
        const message = req.body;
        User.findById(req.user.id).then((user) => {
            return Message.create({
                ...message,
                username: user.username
            });
        }).then((save) =>
            emitter.emit('newMessage', save)
        ).then(() =>
            res.status(200)
        ).catch((e) =>
            res.status(500).json({ error: e })
        );
    }
}


module.exports = new EventsourceController();
