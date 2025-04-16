const Router = require('express');
const controller = require('./eventsourceController');
const authMiddleware = require('./middleware/authMiddleware');

const router = new Router();

router.get('/', [
    authMiddleware
], controller.connect);
router.post('/', [
    authMiddleware
], controller.message);

module.exports = router;
