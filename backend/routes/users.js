const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const { ocrSpace } = require('ocr-space-api-wrapper');
const { client } = require('../db');
dotenv.config();

const upload = multer({ dest: path.join(__dirname, '../uploads') });
const openai = new OpenAI();

router.post('/upload', upload.single('file'), async (req, res) => {
    const email = 'ksukshavasi@gmail.com';

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // OCR processing
        const result = await ocrSpace(req.file.path, {
            apiKey: process.env.OCR_API_KEY,
            filetype: 'pdf',
        });

        if (result.isError) {
            return res
                .status(500)
                .send('An error occurred while processing the file');
        }

        const extractedText = result.ParsedResults[0].ParsedText;

        // Delete the uploaded file after processing
        fs.unlinkSync(req.file.path);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that summarizes resumes.',
                },
                {
                    role: 'user',
                    content: `Please summarize the following resume text:\n\n${extractedText} Return as a JSON object. Do not include code snippets in the response. Also, return a field called 'category' which will have one of these ['Technology'] \n Take this as a template: {
  "name": "Kashyap Sukshavasi",
  "location": "Vancouver, BC",
  "experience": [
    {
      "title": "Undergraduate Research Volunteer",
      "organization": "University of British Columbia Department of Mathematics",
      "dates": "May 2024 - Present",
      "location": "Vancouver",
      "responsibilities": [
        "Focused on Bayesian Methods, Ordinary Differential and Partial Differential Equations.",
        "Analyzed life expectancy through ODE and models.",
        "Enhanced Python code for simulations and applications."
      ]
    },
    {
      "title": "Orientation Leader",
      "organization": "University of British Columbia",
      "dates": "Jun 2024 - 2024",
      "location": "Vancouver",
      "responsibilities": [
        "Welcomed and guided a group of 10 new students.",
        "Promoted an inclusive and supportive community.",
        "Collaborated to organize and run events for student onboarding."
      ]
    }
  ],
  "technical_skills": ["Python", "Java"]
}`,
                },
            ],
        });

        let summary = completion.choices[0].message.content;
        summary = JSON.parse(summary);

        const db = client.db('skillSharing');
        const collection = db.collection('users');

        const updatedUser = await collection.updateOne(
            { email },
            {
                $set: {
                    summary,
                },
            },
            { upsert: true }
        );

        if (updatedUser.modifiedCount === 0) {
            return res.send('Failed to update user');
        }

        return res.json({
            status: true,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing the file');
    }
});

//New route to get user info?
router.get('/user-info', async (req, res) => {
    const email = 'ksukshavasi@gmail.com'; //hardcode needewd for now

    try {
        const db = client.db('skillSharing');
        const collection = db.collection('users');

        const user = await collection.findOne(
            { email },
            {
                projection: {
                    'summary.name': 1,
                    'summary.location': 1,
                    email: 1,
                    'summary.category': 1,
                },
            }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Format the response data
        const userInfo = {
            name: user.summary.name,
            location: user.summary.location,
            email: user.email,
            category: user.summary.category,
        };

        res.json(userInfo);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).send('An error occurred while fetching the user info');
    }
});