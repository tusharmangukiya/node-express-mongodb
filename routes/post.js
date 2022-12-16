const router = require('express').Router();
const { validate } = require('express-validation');

const { all } = require('../validations/comment');
const { show, create, update, destroy, isExists } = require('../validations/post');
const { isAuth } = require('../middlewares/authentication');

/**
 * Controllers
 */
const POST = require('../controllers/post');
const COMMENT = require('../controllers/comment');

router.get('/', POST.all);
router.get('/:id',isAuth(['admin', 'user']), validate(show), isExists, POST.show);
router.post('/', isAuth(['admin', 'user']), validate(create), POST.store);
router.put('/:id', isAuth(['admin', 'user']), validate(update), isExists, POST.update);
router.delete('/:id', isAuth(['admin', 'user']), validate(destroy), isExists, POST.destroy);
router.get('/:id/comments', validate(all), COMMENT.all);

module.exports = router;