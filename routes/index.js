const authRoutes = require('./auth.route');
const mangaRoutes = require('./manga.route');

module.exports = [
    {path: 'auth', handler: authRoutes},
    {path: 'manga', handler: mangaRoutes}
];
