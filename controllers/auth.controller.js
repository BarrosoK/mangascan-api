const {respond} = require('../utils/utils');
const User = require('../models/user.model');
// const bcrypt = require('bcrypt');

module.exports.register = async (req, res) => {
    const body = req.body;

    // const hash = await bcrypt.hash(body.password, 10);
    // console.log(hash);

    console.log(body);

    const user = new User({
        name: body.name,
        email: body.email,
        password: body.password
    });
    try {
        await user.save();
    } catch (e) {
        switch (e.code) {
            case 11000:
                respond(res, 'ko', {error: 'email already used'}, 400);
                break;
            default:
                respond(res, 'ko', {error: 'wtf did u do ??'}, 400)

        }
    } finally {
        respond(res, 'ok');
    }
};
