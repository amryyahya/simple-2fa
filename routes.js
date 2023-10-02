const {
    loginViewHandler, registerViewHandler, registerHandler, loginHandler, authenticatorApp, authenticatorAppResult, verifyTwoFactorAuth, logoutHandler, dashboardHandler
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
        path: '/dashboard',
        handler: dashboardHandler
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
        options: {
            state: {
                parse: true,
                failAction: 'error'
            }
        }
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
    {
        method: 'GET',
        path: '/logout',
        handler: logoutHandler
    }
]

module.exports = routes;