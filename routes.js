const {
    loginViewHandler, registerViewHandler, registerHandler, loginHandler, authenticatorApp, authenticatorAppResult, verifyTwoFactorAuth
  } = require('./handler');

const routes = [
    {
        method: 'GET',
        path: '/authenticatorapp',
        handler: authenticatorApp
    },
    {
        method: 'POST',
        path: '/authenticatorapp',
        handler: authenticatorAppResult
    },
    {
        method: 'POST',
        path: '/dashboard',
        handler: verifyTwoFactorAuth
    },
    {
        method: 'GET',
        path: '/login',
        handler: loginViewHandler,
    },
    {
        method: 'POST',
        path: '/login',
        handler: loginHandler,
    },
    {
        method: 'GET',
        path: '/register',
        handler: registerViewHandler,
    },
    {
        method: 'POST',
        path: '/register',
        handler: registerHandler,
    },
]

module.exports = routes;