const {check, body, validationResult} = require('express-validator');

module.exports.validatorsValid = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

/*
 * if @body is an integer it will be used as status code
 */
module.exports.respond = (res, message, body, status = 200) => {
    if (Number.isInteger(body)) {
        return res.status(body).json({message});
    }
    res.status(status).json({...body, message});
};

const pad = num => (num > 9 ? "" : "0") + num;


module.exports.generator = (time, index) => {
    if (!time) {
        time = new Date();
        index = 1;
    }

    var year = time.getFullYear();
    var month = pad(time.getMonth() + 1);
    var day = pad(time.getDate());
    var hour = pad(time.getHours());
    var minute = pad(time.getMinutes());

    return `${year}/${month}/${day}-${hour}:${minute}-${index}-access.log`;
};
