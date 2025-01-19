const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { ocrSpace } = require('ocr-space-api-wrapper');
const { client } = require('../db');
const Groq = require("groq-sdk"); // Import Groq SDK
dotenv.config();

// Initialize Groq client
const groq = new Groq();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (file.mimetype === 'application/pdf' && fileExtension === '.pdf') {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only PDF files are allowed!'), false); // Reject the file
    }
};

const upload = multer({ storage, fileFilter });

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
    const email = 'dummyemail@gmail.com';

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        console.log('Uploaded file:', req.file);

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
        console.log("processing done?")
        const extractedText = result.ParsedResults[0].ParsedText;
        console.log(extractedText)

        // Delete the uploaded file after processing (optional)
        // fs.unlinkSync(req.file.path);

        // Groq Chat Completion
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes resumes.",
                },
                {
                    role: "user",
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
            temperature: 0.5,
            max_completion_tokens: 1024,
            top_p: 1,
        });
        
        let summary = chatCompletion.choices[0]?.message?.content;

        // Log the raw response for debugging
        console.log("Raw Summary Response:", summary);

        // Attempt to extract JSON using a regex
        const jsonMatch = summary.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in the response.");
        }

        // Parse the extracted JSON
        summary = JSON.parse(jsonMatch[0]);

        // Log the parsed JSON for validation
        console.log("Parsed Summary Object:", summary);

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
            console.log("Failed to update user")
            return res.send('Failed to update user');
        }

        console.log(updatedUser)
        
        return res.json({
            status: true,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing the file');
    }
});


// New route to get user information based on email
router.get('/user-info', async (req, res) => {
    const email = 'dummyemail@gmail.com'; // Hardcoded email for now

    try {
        const db = client.db('skillSharing');
        const collection = db.collection('users');

        // Find the user with the specified email and select only name, location, email, and category fields
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
            console.log("user not found")
            return res.status(404).send('User not found');
        }

        // Format the response data
        const userInfo = {
            name: user.summary.name,
            location: user.summary.location,
            email: user.email,
            category: Array.isArray(user.summary.category) ? user.summary.category : [user.summary.category],
        }; 
        console.log(userInfo)

        res.json(userInfo);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).send('An error occurred while fetching the user info');
    }
});

router.get('/get-my-jobs', async (req, res) => {
    const email = 'dummyemail@gmail.com';

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        const db = client.db('skillSharing');
        const collection = db.collection('jobs');

        // Find all jobs posted by the user with the specified email
        const jobs = await collection.find({ email }).toArray();
        console.log(jobs)

        if (jobs.length === 0) {
            return res.send('No jobs found');
        }

        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send('An error occurred while fetching the jobs');
    }
});

module.exports = router;