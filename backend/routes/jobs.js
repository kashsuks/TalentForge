const router = require('express').Router();
const {client} = require('../db');

const db = client.db('skillSharing');
const collection = db.collection('jobs');

router.post('/post-job', async (req, res) => {
    const email = 'dummyemail@gmail.com';
    const {
        description,
        requestedSkill,
        mySkill,
        location,
        dueDate,
        comments,
    } = req.body;
    //   console.log(title, description, skill, location, dueDate, comments);
    const job = {
        description,
        requestedSkill,
        mySkill,
        location,
        dueDate,
        comments,
        email,
    };

    const result = await collection.insertOne(job);

    if (result.insertedCount === 0) {
        return res.json({
            status: false,
        });
    }

    return res.json({
        status: true,
    });
});

module.exports = router;