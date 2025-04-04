# aeternum-X
 
# Project Overview

## Purpose & Functionality

Aeternum is an AI-driven healthcare solution designed to enhance early detection and prevention of chest and heart diseases. Using advanced machine learning models, it analyzes patient data to provide accurate predictions and timely medical insights. The system integrates an ambulance and hospital management system for seamless healthcare coordination.

## Problem Statement

Late diagnosis of critical conditions like pneumonia, fibrosis, arrhythmia, and cardiomyopathy leads to severe complications. Limited access to specialists, high diagnostic costs, and misinterpretation of reports contribute to delayed treatment. Aeternum addresses this gap by offering AI-powered detection, ensuring early intervention and improved patient outcomes.

## Key Features & Benefits

- AI-powered disease detection using TensorFlow and Scikit-Learn.
- Integrated ambulance and hospital management systems for better patient care.
- Teleconsultation for secure data sharing.
- Scalable SaaS model for hospitals and healthcare providers.
- API integration for existing telehealth platforms.

# Dependencies

## Programming Languages & Frameworks
- Python 3.9
- JavaScript (Node.js 22.x)
- Express.js 4.17
- React.js 18.0

## Machine Learning Libraries
- TensorFlow 2.16.2
- Scikit-Learn 1.3.2
- NumPy 1.26.2
- Pandas 2.1.4
- Uvicorn 0.23.2

## Backend & API Development
- Flask 3.0.2
- FastAPI 0.103.1
- MongoDB (Database) 

## Cloud & Deployment Tools
- Render
- Vercel (for frontend hosting)

## Authentication & Security
- Firebase Authentication
- bcrypt 5.1

Ensure all dependencies are installed using pip or npm before running the project.

# Setup Instructions:
## 1. Clone the Repository
Open a terminal or PowerShell window and run the following commands:
```
git clone https://github.com/ImNotorious/aeternum-X.git
```

## 2. Install and Run the Client
Open a new terminal/PowerShell window (Terminal #1).

Navigate to the client folder:

```
cd client
```
Install the dependencies (using --legacy-peer-deps to resolve any peer dependency conflicts):
```
npm install --legacy-peer-deps
```
(Optional) Install additional packages if needed:
```
npm install react@18 react-dom@18 date-fns@3.6.0 firebase @next-auth/mongodb-adapter bcryptjs mongodb --legacy-peer-deps
```
Start the client development server:
```
npm run dev
```
The client should now be running at http://localhost:3000 or the port specified in your configuration.

## 3. Install and Run Model_1 (Server)
Open another terminal/PowerShell window (Terminal #2).

Navigate to the server/model_1 folder:

```
cd server/model_1
```
Install the Python dependencies:
```
pip install -r requirements.txt
```
Start the Python application:
```
python app.py
```
Model_1 should now be accessible at http://localhost:5000/predict.

## 4. Install and Run Model_2 (Server)
Open a third terminal/PowerShell window (Terminal #3).

Navigate to the server/model_2 folder:
```
cd server/model_2
```
Install the Python dependencies:
```
pip install -r requirements.txt
```
Start the Uvicorn server:
```
uvicorn main:app --host 0.0.0.0 --port 8000
```
Model_2 should now be accessible at http://localhost:8000/predict.

## 5. Usage
Start all services:

Client: Run npm run dev in Terminal #1.

Model_1: Run ```python app.py``` in Terminal #2.

Model_2: Run ```uvicorn main:app --host 0.0.0.0 --port 8000``` in Terminal #3.

Open your web browser and navigate to http://localhost:3000 (or the configured port for your client).

Interact with the UI, which will communicate with both server models as per your application logic.

## 6. Troubleshooting
Dependency Issues (Client): Use the ```--legacy-peer-deps flag``` if you encounter peer dependency conflicts.

Python Dependency Issues: Ensure you are using a compatible Python version and have the correct privileges or virtual environment.

Port Conflicts: Modify the port settings in package.json (client) or in the Python configuration files if necessary.


# Team Members

## Amulya Tripathi - AI/ML Lead

Amulya focused on developing and optimizing machine learning models for disease detection. He worked with TensorFlow and Scikit-Learn to improve prediction accuracy and integrated AI capabilities into the system.

## Akshat Jain - Backend Lead

Akshat handled the backend architecture, API development, and database management. He ensured seamless communication between the AI models and the web application using FastAPI and MongoDB.

## Aryan Sethi - Frontend Developer & Project Lead

Aryan designed and implemented the user interface using React.js. He also took charge of creating the presentation, business plan and future model to showcase Aeternum's capabilities.

## Suman Sharma - Backend Developer

Suman worked on backend infrastructure and system security, implementing authentication mechanisms and optimizing performance for a scalable SaaS model.

# Future Plans

## Real-time Monitoring

Developing a real-time patient monitoring system to track vitals and detect anomalies for timely interventions.

## Wearable Device Integration

Syncs with smartwatches and fitness trackers for real-time health monitoring and early alerts, providing continuous health insights.

## Personalized Health Insights

AI-driven custom health recommendations based on medical history, lifestyle, and real-time data for proactive disease prevention.

## HIPAA & GDPR Compliance

Ensures secure, compliant data handling under global healthcare privacy laws (HIPAA, GDPR) to protect patient information.

## Teleconsultation Expansion

Expanding our teleconsultation services to integrate with more healthcare providers and enable direct doctor-patient interactions.

## Global Scalability

Scaling the platform to support multilingual access and adapt to international medical standards for broader adoption.

## API for Third-party Integration

Providing APIs for seamless integration with existing hospital management and telemedicine platforms, ensuring interoperability and improved healthcare services.

## Blockchain Integration

Future updates will incorporate blockchain for secure, immutable medical records, ensuring transparency and data integrity.

## Mobile Application

A dedicated mobile app for improved accessibility, enabling users to upload reports, receive analysis, and consult specialists.

## Enhanced AI Accuracy

We aim to refine our AI models using additional datasets and advanced deep learning techniques to improve diagnostic accuracy.
