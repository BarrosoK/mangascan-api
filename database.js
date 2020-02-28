const mongoose = require('mongoose');

console.log('BONJOUR' + 'mongodb://' + process.env.DB_USER + ":" + process.env.DB_PWD + "@" + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME);

mongoose.connect('mongodb://' + process.env.DB_USER + ":" + process.env.DB_PWD + "@" + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME,
    {useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to mongodb !');
});
