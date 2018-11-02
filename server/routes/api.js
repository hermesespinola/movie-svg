const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).send('Hi!');
});

router.get('/protected', (req, res) => {
    res.send(JSON.stringify(req.jwt));
});

module.exports = router;
