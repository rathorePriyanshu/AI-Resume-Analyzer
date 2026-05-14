# AI Resume Analyzer

## Description

AI Resume Analyzer is a web application that evaluates resumes based on a given job role, company, and job description. It analyzes uploaded resumes and provides structured feedback, improvement suggestions, and an estimated ATS (Applicant Tracking System) score.

The application extracts text from resumes using OCR and processes it through large language models to generate relevant insights. It is designed to simulate real-world resume screening by aligning feedback with job-specific requirements.

The system supports authenticated and unauthenticated usage modes. Authenticated users can save and revisit their analyzed resumes and feedback, while unauthenticated users can use the tool without data persistence. The project focuses on integrating AI models, handling document processing, and maintaining a smooth user experience with persistent storage.

---

## Features

### 📄 Resume Analysis

Analyze resumes based on job title, company, and job description.

### 🤖 AI-Powered Feedback

Generate detailed feedback and improvement suggestions using LLMs.

### 📊 ATS Score Calculation

Estimate how well a resume matches job requirements.

### 🔍 OCR Text Extraction

Extract text from PDFs and images using Tesseract OCR.

### 💾 Saved Analyses (Authenticated Users)

Store resumes and feedback for future access.

### ⚡ Instant Results (Guest Users)

Use the analyzer without login, with no data persistence.

### 🖼️ Resume Preview

View uploaded resumes directly within the application.

### 🔐 Authentication

User-based access for saving and managing resume analyses.

---


## Demo Screenshots

### HomePage
<img width="1917" height="928" alt="Screenshot 2026-03-21 164413" src="https://github.com/user-attachments/assets/287f69b2-69b8-4c05-9a4a-cebd926ac56e" />

### AuthUser's Saved Data
<img width="1919" height="931" alt="Screenshot 2026-03-21 164432" src="https://github.com/user-attachments/assets/5236758b-69f1-41d0-ab82-0e8a48bf5799" />

### Upload Resume Page
<img width="1916" height="928" alt="Screenshot 2026-03-21 164518" src="https://github.com/user-attachments/assets/047e1b5e-821a-4137-814d-56fd17d95c83" />

### Datafields
<img width="1916" height="930" alt="Screenshot 2026-03-21 164710" src="https://github.com/user-attachments/assets/86e41020-e525-4e6e-8e24-8e6842413627" />

### ATS Score & AI Feedback
<img width="1918" height="927" alt="Screenshot 2026-03-21 180903" src="https://github.com/user-attachments/assets/fb95fb9e-e3db-412b-9e87-f324bc926155" />

### Improvement Sections
<img width="1919" height="928" alt="Screenshot 2026-03-21 180936" src="https://github.com/user-attachments/assets/721c092e-164e-471f-9092-26a7c552a71f" />

---

## Technology Stack

* React
* TypeScript
* Tailwind CSS
* Supabase (Database + Authentication)
* Tesseract OCR (Text Extraction)
* DeepSeek (Feedback Generation)
* Qwen LLM (AI Response Processing)

---

## Technical Highlights

- Implemented OCR pipeline to extract structured text from resumes  
- Integrated multiple LLMs for feedback generation and response handling  
- Designed job-specific analysis by combining resume data with role requirements  
- Built persistent storage using Supabase with user-based access control 


