# HireLens AI

## AI-Powered Resume & Job Matching System

HireLens AI is an AI-powered resume screening and job matching system designed to help recruiters analyze candidate resumes against job requirements.

The system extracts relevant information from uploaded resumes, compares candidate skills, experience, and education with job requirements, calculates a match score, identifies matched and missing skills, provides an explanation for the result, and helps recruiters rank candidates.

---

## Problem Statement

Recruiters often receive hundreds of resumes for a single job opening.

Manually reviewing and comparing every resume with a job description can be:

- Time-consuming
- Repetitive
- Difficult to scale
- Inconsistent
- Difficult to compare objectively

Recruiters need a faster and more structured way to identify candidates who are relevant to a particular job.

HireLens AI addresses this problem by automating resume analysis and candidate-job matching.

---

## Solution

HireLens AI provides a recruitment workflow that allows recruiters to create jobs, upload candidate resumes, analyze resumes using AI, and compare candidates with job requirements.

The system:

1. Allows recruiters to create job requirements.
2. Accepts candidate resumes in PDF format.
3. Extracts text from uploaded resumes.
4. Uses AI to analyze relevant candidate information.
5. Extracts candidate skills, education, experience, and basic details.
6. Compares candidate information with job requirements.
7. Calculates an overall match score.
8. Identifies matched and missing skills.
9. Generates an explanation for the candidate's match.
10. Helps recruiters compare and rank candidates.

---

## Objectives

The main objectives of HireLens AI are:

- Reduce manual resume screening effort.
- Speed up the initial candidate evaluation process.
- Provide structured candidate-job comparison.
- Identify relevant candidate skills.
- Identify missing required skills.
- Provide explainable matching results.
- Help recruiters prioritize suitable candidates.

---

## Key Features

### Recruiter Authentication

- Recruiter registration
- Recruiter login
- JWT-based authentication
- Protected application routes
- Password hashing

### Job Management

Recruiters can create jobs with:

- Job title
- Company name
- Job description
- Required skills
- Required experience

### Resume Upload

- PDF resume upload
- PDF file validation
- File size validation
- Resume text extraction
- Candidate information processing

### AI Resume Analysis

The system analyzes extracted resume content using the Google Gemini API.

The system extracts relevant candidate information such as:

- Candidate name
- Email
- Skills
- Education
- Experience

### Candidate Matching

The candidate is compared with the selected job using:

- Skills
- Experience
- Education

### Match Score

Each candidate receives an overall match score based on the implemented matching factors.

### Matched Skills

The system identifies skills from the candidate's resume that match the required job skills.

### Missing Skills

The system identifies required job skills that are not found in the candidate's resume.

### Explainable Results

HireLens AI provides an explanation along with the candidate's score so recruiters can understand the result.

### Candidate Ranking

Candidates can be compared and ranked according to their overall match scores.

---

## How HireLens AI Works

```text
Recruiter
    |
    v
Register / Login
    |
    v
Create Job
    |
    v
Enter Job Requirements
    |
    v
Upload Candidate Resume
    |
    v
Validate PDF
    |
    v
Extract Resume Text
    |
    v
AI Resume Analysis
    |
    v
Extract Candidate Information
    |
    v
Compare Candidate With Job
    |
    v
Calculate Match Score
    |
    v
Identify Matched & Missing Skills
    |
    v
Generate Match Explanation
    |
    v
Candidate Ranking
```

---

## System Workflow

### Step 1: Register

The recruiter creates an account using the registration page.

### Step 2: Login

The recruiter logs into the application using their credentials.

### Step 3: Create Job

The recruiter enters the job information:

- Job title
- Company name
- Job description
- Required skills
- Required experience

### Step 4: Upload Resume

The recruiter uploads a candidate resume in PDF format.

### Step 5: Validate Resume

The backend validates the uploaded file.

The application currently accepts PDF resumes with a maximum file size of 5 MB.

### Step 6: Extract Resume Text

The uploaded PDF is processed and its text is extracted.

### Step 7: AI Resume Analysis

The extracted resume content is analyzed using the Google Gemini API.

### Step 8: Extract Candidate Information

The system extracts relevant candidate information such as:

- Candidate name
- Email
- Skills
- Education
- Experience

### Step 9: Match Candidate

The candidate information is compared with the job requirements.

### Step 10: Calculate Match Score

The matching engine calculates the candidate's overall match score.

### Step 11: Identify Skills

The system identifies:

- Matched skills
- Missing skills

### Step 12: Generate Explanation

The system provides an explanation for the candidate's match result.

### Step 13: Rank Candidates

Candidates can be compared according to their overall match scores.

---

## Match Scoring

HireLens AI currently uses three main factors for candidate matching:

- Skills
- Experience
- Education

The scoring weights are:

- Skills: 60%
- Experience: 25%
- Education: 15%

The final score is calculated using:

```text
Final Score =
(Skill Match × 0.60)
+
(Experience Match × 0.25)
+
(Education Match × 0.15)
```

---

## Match Score Example

For example, if a candidate has:

```text
Skill Match = 100%
Experience Match = 0%
Education Match = 100%
```

The final score is:

```text
Final Score =
(100 × 0.60)
+
(0 × 0.25)
+
(100 × 0.15)

Final Score = 75%
```

Therefore, the candidate receives an overall match score of:

```text
75%
```

---

## System Architecture

```text
                         +----------------------+
                         |      Recruiter       |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |   React Frontend     |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |   Express Backend    |
                         +----------+-----------+
                                    |
                  +-----------------+-----------------+
                  |                 |                 |
                  v                 v                 v
        +----------------+ +----------------+ +----------------+
        | Authentication | | Job Management | | Resume Upload  |
        +----------------+ +----------------+ +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | PDF Text       |
                                               | Extraction     |
                                               +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | Google Gemini  |
                                               | AI Analysis    |
                                               +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | Candidate      |
                                               | Information    |
                                               +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | Matching       |
                                               | Engine         |
                                               +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | Match Score    |
                                               +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | Explanation    |
                                               +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | Candidate      |
                                               | Ranking        |
                                               +----------------+

                                    |
                                    v
                         +----------------------+
                         |    MongoDB Atlas     |
                         +----------------------+
```

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- Mongoose
- Multer
- pdf2json
- bcryptjs
- JSON Web Token
- dotenv
- CORS

### AI

- Google Gemini API
- Google GenAI SDK

### Database

- MongoDB
- MongoDB Atlas

### Deployment

- Vercel

---

## Project Structure

```text
AI-RESUME-MATCHER/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── JobForm.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── MatchScore.jsx
│   │   │   └── Loading.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   ├── Candidates.jsx
│   │   │   └── CandidateDetails.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── api/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── resumeController.js
│   │   └── matchController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Resume.js
│   │   └── Match.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── matchRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── services/
│   │   ├── pdfService.js
│   │   ├── aiService.js
│   │   └── matchingService.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── uploads/
│   │
│   ├── server.js
│   ├── package.json
│   ├── vercel.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- MongoDB Atlas account
- Google Gemini API key

---

## Clone Repository

Clone the GitHub repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd AI-RESUME-MATCHER
```

---

## Backend Setup

Open the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal.

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

---

## Environment Variables

### Backend

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

For production deployment, change `VITE_API_URL` to the deployed backend URL.

Do not upload `.env` files or API keys to GitHub.

---

## API Structure

The backend contains the following main API route groups:

```text
/api/auth
/api/jobs
/api/resumes
/api/matches
```

These routes handle:

- Authentication
- Job management
- Resume processing
- Candidate matching

---

## Database Structure

HireLens AI uses MongoDB Atlas for storing application data.

### User

Stores recruiter information:

```text
name
email
password
role
createdAt
updatedAt
```

### Job

Stores job information:

```text
recruiterId
title
company
description
requiredSkills
experienceRequired
createdAt
updatedAt
```

### Resume

Stores candidate resume information:

```text
jobId
candidateName
email
fileName
filePath
extractedText
skills
education
experience
createdAt
updatedAt
```

### Match

Stores candidate matching results:

```text
jobId
resumeId
candidateName
score
skillMatch
experienceMatch
educationMatch
matchedSkills
missingSkills
explanation
createdAt
updatedAt
```

---

## Resume Processing

The resume processing workflow is:

```text
PDF Resume
    |
    v
PDF Validation
    |
    v
Multer Memory Storage
    |
    v
PDF Text Extraction
    |
    v
Extracted Resume Text
    |
    v
AI Resume Analysis
    |
    v
Candidate Information
```

The application currently supports PDF resumes.

The uploaded PDF is processed in memory, which avoids depending on persistent local file storage in the deployed environment.

---

## AI Resume Analysis

The AI analysis workflow is:

```text
Resume Text
    |
    v
Google Gemini API
    |
    v
Resume Analysis
    |
    v
Candidate Information
    |
    +----> Candidate Name
    |
    +----> Email
    |
    +----> Skills
    |
    +----> Education
    |
    +----> Experience
```

Google Gemini is used to analyze the extracted resume content and identify relevant candidate information.

---

## Candidate Matching

The candidate matching workflow is:

```text
Candidate Information
        |
        v
+-----------------------+
| Candidate Skills      |
| Candidate Experience  |
| Candidate Education   |
+-----------+-----------+
            |
            v
+-----------------------+
| Job Requirements      |
| Required Skills       |
| Required Experience   |
| Job Description       |
+-----------+-----------+
            |
            v
     Matching Engine
            |
            v
+-----------------------+
| Skill Match           |
| Experience Match      |
| Education Match       |
+-----------+-----------+
            |
            v
      Final Score
            |
            v
 Matched / Missing Skills
            |
            v
       Explanation
```

---

## Testing

The main application workflow has been tested:

```text
Registration
    |
    v
Login
    |
    v
Create Job
    |
    v
Upload Resume
    |
    v
PDF Text Extraction
    |
    v
AI Resume Analysis
    |
    v
Candidate Information
    |
    v
Candidate Matching
    |
    v
Score Calculation
    |
    v
Matched & Missing Skills
    |
    v
Match Explanation
    |
    v
Candidate Ranking
```

The following functionality has been tested:

- Recruiter registration
- Recruiter login
- Authentication
- Job creation
- PDF resume upload
- PDF validation
- Resume text extraction
- AI resume analysis
- Candidate information extraction
- Skill matching
- Experience matching
- Education matching
- Match score calculation
- Matched skills
- Missing skills
- Candidate ranking
- Production backend deployment

---

## Security

HireLens AI uses basic security practices including:

- JWT-based authentication
- Password hashing
- Protected API routes
- Environment variables for sensitive information
- PDF file validation
- File size restrictions
- CORS configuration

Sensitive information such as:

- MongoDB credentials
- JWT secret
- Gemini API key

is not included in the GitHub repository.

---

## Limitations

The current version has some limitations:

- Scanned or image-only PDFs may not extract text correctly.
- AI-generated information should be verified by the recruiter.
- Matching accuracy depends on the information available in the resume.
- The scoring system currently uses predefined weights.
- The application currently supports PDF resumes.
- AI output may vary depending on the quality and structure of the resume.

---

## Future Improvements

Future versions could include:

- OCR support for scanned resumes
- Support for additional resume formats
- Semantic resume matching
- Vector embeddings
- Improved candidate ranking
- Candidate recommendations
- Job recommendations
- Advanced recruiter analytics
- Resume comparison
- Improved contradiction detection
- More advanced explainable AI results

---

## External APIs

### Google Gemini API

Google Gemini API is used for AI-powered resume analysis and candidate information extraction.

The API key is stored in an environment variable and is not included in the source code.

---

## Libraries and Technologies Used

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- Mongoose
- Multer
- pdf2json
- bcryptjs
- JSON Web Token
- dotenv
- CORS

### AI

- Google Gemini API
- Google GenAI SDK

### Database

- MongoDB
- MongoDB Atlas

### Deployment

- Vercel

---

## Dataset

No external dataset was used in this project.

The system works with:

- Job descriptions entered by recruiters
- Candidate resumes uploaded by recruiters

---

## AI-Assisted Development

AI-assisted development tools, including ChatGPT, were used during development.

AI assistance was used for:

- Development guidance
- Debugging
- Code suggestions
- Problem solving
- Documentation assistance

The final project was implemented, integrated, tested, and reviewed by the participant.

---

## Deployment

The backend is deployed on Vercel.

### Backend URL

```text
https://hire-lens-ai-eight.vercel.app
```

### Frontend URL

```text
https://hire-lens-ai-2yts.vercel.app/
```

### GitHub Repository

```text
https://github.com/Manikanta-Achar/HireLens-AI
```

---

## How to Use the Deployed Application

### Step 1

Open the HireLens AI frontend.

### Step 2

Register a recruiter account.

### Step 3

Login to the application.

### Step 4

Create a job by entering:

- Job title
- Company name
- Job description
- Required skills
- Required experience

### Step 5

Upload a candidate PDF resume.

### Step 6

Wait for resume processing and analysis.

### Step 7

View the candidate information and matching result.

### Step 8

Check:

- Overall match score
- Skill match
- Experience match
- Education match
- Matched skills
- Missing skills
- Match explanation

### Step 9

Compare candidates and identify the most relevant candidates.

---

## Hackathon

### ALGOTHON'26

**Project Name:** HireLens AI

**Problem Statement:** AI Resume & Job Matching System

HireLens AI was developed as a solution for the AI Resume & Job Matching problem statement.

The project focuses on:

- Resume analysis
- Job requirement analysis
- Candidate matching
- Candidate scoring
- Candidate ranking
- Explainable matching results

---

## Project Summary

HireLens AI provides an AI-powered workflow for resume screening and candidate-job matching.

The complete workflow is:

```text
Recruiter
    |
    v
Register / Login
    |
    v
Create Job
    |
    v
Enter Job Requirements
    |
    v
Upload Resume
    |
    v
Validate PDF
    |
    v
Extract Resume Text
    |
    v
AI Resume Analysis
    |
    v
Extract Candidate Information
    |
    v
Compare Candidate With Job
    |
    v
Calculate Match Score
    |
    v
Identify Matched & Missing Skills
    |
    v
Generate Match Explanation
    |
    v
Rank Candidates
```

HireLens AI aims to make the initial resume screening process faster, more structured, and easier for recruiters to understand.

---

## Author

**Manikanta Achar**

---

## Project Information

**Project:** HireLens AI

**Category:** AI / Machine Learning

**Type:** AI-Powered Resume & Job Matching System

**Frontend:** React

**Backend:** Node.js + Express.js

**Database:** MongoDB Atlas

**AI:** Google Gemini API

**Deployment:** Vercel
