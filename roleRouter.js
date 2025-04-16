const Router = require('express');
const controller = require('./roleController');
const { check } = require('express-validator');
const roleMiddleware = require('./middleware/roleMiddleware');

const router = new Router();

router.post('/', [
    check('role', 'the role cannot be empty and must be more than 4 characters long')
        .notEmpty()
        .isLength({ min: 4 }),
    roleMiddleware(['admin'])
], controller.create);
router.get('/', controller.getRoles);
router.patch('/', [
    check('role', 'the role cannot be empty')
        .notEmpty(),
    roleMiddleware(['admin'])
], controller.updateUserRole);
router.delete('/', [
    check('role', 'the role cannot be empty')
        .notEmpty(),
    roleMiddleware(['admin'])
], controller.delete);

module.exports = router;