const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { client } = require('../db');

// Set up MongoDB collection
const db = client.db('skillSharing');
const collection = db.collection('jobs');

// Set up multer to store audio files in the 'recordings' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const recordingsPath = path.join(__dirname, '../recordings');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(recordingsPath)) {
      fs.mkdirSync(recordingsPath, { recursive: true });
    }
    
    cb(null, recordingsPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename using a timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to handle job posting with optional audio file upload
router.post('/post-job', upload.single('recording'), async (req, res) => {
  const email = 'dummyemail@gmail.com';
  const { description, requestedSkill, mySkill, location, dueDate, comments } = req.body;

  // Prepare job data
  const job = {
    description,
    requestedSkill,
    mySkill,
    location,
    dueDate,
    comments,
    email,
    recordingPath: req.file ? `/recordings/${req.file.filename}` : null, // Save file path in job data
  };

  try {
    const result = await collection.insertOne(job);

    if (result.insertedCount === 0) {
      return res.json({ status: false });
    }

    return res.json({ status: true });
  } catch (err) {
    console.error('Error saving job:', err);
    return res.json({ status: false, error: err.message });
  }
});

// Route to fetch all jobs (with optional filtering for 'Technology' requestedSkill)
router.get('/get-all-jobs', async (req, res) => {
  try {
    let jobs = await collection.find().toArray();

    if (jobs.length === 0) {
      return res.send('No jobs found');
    }

    // Filter jobs with requested skill equal to 'Technology'
    jobs = jobs.filter((job) => job.requestedSkill === 'Technology');
    return res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).send('Failed to fetch jobs');
  }
});

// Route to serve audio files from the 'recordings' folder
router.get('/recording/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../recordings', req.params.filename);
  res.sendFile(filePath);
});

module.exports = router;
