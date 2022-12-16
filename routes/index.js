const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../swagger.json');
const { swageerOptions } = require('../config');

router.get('/',(req, res, next) => res.redirect('api-docs'));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swageerOptions));
router.use('/auth', require("./auth"));
router.use('/post', require("./post"));
router.use('/comment', require("./comment"));

module.exports = router;
