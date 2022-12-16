const router = require('express').Router();
const { validate } = require('express-validation');

const { show, create, update, destroy, isExists } = require('../validations/comment');
const { isAuth } = require('../middlewares/authentication');

/**
 * Controllers
 */
const COMMENT = require('../controllers/comment');


router.get('/:id',isAuth(['admin', 'user']), validate(show), isExists, COMMENT.show);
router.post('/', isAuth(['admin', 'user']), validate(create), COMMENT.store);
router.put('/:id', isAuth(['admin', 'user']), validate(update), isExists, COMMENT.update);
router.delete('/:id', isAuth(['admin', 'user']), validate(destroy), isExists, COMMENT.destroy);


module.exports = router;