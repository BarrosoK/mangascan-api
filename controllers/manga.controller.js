const {respond} = require('../utils/utils');
const User = require('../models/user.model');
const mangakakalot = require('./mangakakalot');

module.exports.list = async (req, res) => {
    respond(res, "done", {total: mangakakalot.total, list: mangakakalot.list});
};

module.exports.info = async (req, res) => {
    const id = req.params.manga;
    const result = await mangakakalot.info(id);
    respond(res, "done", {result});
};

module.exports.chapter = async (req, res) => {
    const id = req.params.manga;
    const chapter = req.params.chapter;
    const result = await mangakakalot.chapter(id, chapter);
    respond(res, "done", {imgs: result});
};