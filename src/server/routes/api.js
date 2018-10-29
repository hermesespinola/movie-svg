const express = require('express');

module.exports = (oidc) => {
    const router = express.Router();
    router.get('/health', (req, res) => {
        res.status(200).send('Hi!');
    });

    router.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
        res.send(JSON.stringify(req.userContext.userinfo));
    });

    router.get('/', (req, res) => {
        if (req.userContext && req.userContext.userinfo) {
          res.send(`Hi ${req.userContext.userinfo.name}!`);
        } else {
          res.send('Hi!');
        }
      });

    return router;
};
