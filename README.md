## Author: Sadiya Begum
# Project Title: Our Pursuit

## Brief Description:
Our Pursuit aims to create a global hub website for users, aged 11 to 25, to connect, seek advice, and engage in safe conversations. Implementing a robust profanity filter using Natural Language Processing is crucial to detect and remove offensive language and hate speech, in order to maintain integrity and trust. Features such as email notifications boost user engagement, while prioritizing a visually appealing user experience. The goal is to cultivate a community that promotes inclusivity, support, and self-development.

## Prerequisites
Before you can run this project, ensure that you have the following prerequisites installed on your system:

- **Python:**: Download and install Python. Ensure pip is installed simultaneously.
- **Node.js:**: Download and install Node.js.
- **Conda**: Download and install MiniConda.
- **git**: Download and install git

## Installation

In terminal:

#### Clone repository
git clone https://github.com/SutoBotn/ourpursuit.git

#### Create virtual environment
conda create --name ourpursuit python=3.10

#### Activate environment
conda activate ourpursuit

#### Navigate into project's saved folder
cd [foldername]

### Backend Setup

#### Navigate to backend folder
cd ourpursuit

#### Install Django
pip install django

#### Install dependencies
pip install -r requirements.txt

#### Apply migrations
python manage.py migrate

#### Run the Django development server
python manage.py runserver

### Frontend Setup

In terminal:

#### Navigate to main project folder (if in 'ourpursuit' folder)
cd ..

#### Navigate to frontend folder
cd frontend

#### Install npm dependencies
npm install

#### Run React frontend
npm start