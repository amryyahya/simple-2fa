const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const handlebars = require('handlebars');
const vision = require('@hapi/vision');
const cookie = require('@hapi/cookie');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
    });
    await server.register([
        {
        plugin: require('@hapi/inert')
        },
        vision,
        cookie
    ])
    server.state('data', {
        ttl: null,
        isSecure: true,
        isHttpOnly: true,
        encoding: 'base64json',
        clearInvalid: true,
        strictHeader: true,
    });

    await server.views({
        engines: {
            html: handlebars,
        },
        relativeTo: __dirname, // Path to your views directory
        path: 'views', // Directory containing your HTML templates
    });
    server.route(routes);
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init(); 