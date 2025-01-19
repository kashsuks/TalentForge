const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/isAuthenticated', (req, res) => {
    res.status(200).json({ isAuthenticated: req.oidc.isAuthenticated() });
});

router.get('/profile', requiresAuth(), (req, res) => {
    res.json(req.oidc.user);
});

module.exports = router;
