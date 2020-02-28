const express = require('express');
const router = express.Router();
const controller = require('../controllers/manga.controller');

router.get('/',
    controller.list);

router.post('/search/:search');

router.get('/:manga',
    controller.info);

router.get('/:manga/:chapter',
    controller.chapter);

module.exports = router;
