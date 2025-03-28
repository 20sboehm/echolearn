# EchoLearn

> [!IMPORTANT]
> EchoLearn is no longer being maintained or hosted.

EchoLearn is a web-based flashcard application optimized for getting information into your long-term memory. It does this through the use of spaced repetition—a memorization technique in which your flashcard reviews are spaced at increasing intervals. This makes it simple and efficient to recall knowledge long after you first learn it. The purpose of EchoLearn is to solve the problem of forgetting the things you’ve learned, whether that be personal information, or knowledge you need for your job or degree.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend](#frontend-section)
3. [Backend](#backend-section)
4. [Quick Start](#quick-start)
5. [Mobile](#mobile-section)
6. [Deployment](#deployment)


## <a name="prerequisites">--- Prerequisites ---</a>

### Frontend
- **Npm**
- **React**
- **React Query**
- **React Router DOM**
- **Tailwind**

### Backend
- **Python**
- **Django Ninja**
- **Django CORS Headers**

### Mobile
- **Expo**
- **NativeWind**

## <a name="frontend-section">--- Frontend ---</a>

All of the following commands will be run inside the frontend directory
`cd frontend`

### 1. Install Dependencies
When you clone this repository, install all required npm packages:
`npm install`

Additional libraries needed to build the project, run the following two command to install:
`npm install react-query`
`npm install react-router-dom`

### 2. Setup Tailwind CSS
Since all our styling use Tailwind CSS, you will need install Tailwind CSS for ths style to appear correctly:
`npm install -D tailwindcss postcss autoprefixer`
`npx tailwindcss init -p`

### 3. Run the Frontend Server
To run the frontend server:
`npm run dev`

### 4. Additional Tip
If you encounter issues with dependencies, you can clearing node_modules and try reinstall:
`rm -rf node_modules`
`npm install`

## <a name="backend-section">--- Backend ---</a>

All of the following commands will be run inside the backend directory
`cd backend` 

### 1. Install Dependencies
All of dependencies will be place inside the requirements.txt. To install them, run:
`pip install -r requirements.txt`

### 2. Local Database Setup
Generate migration files based on models:
`python manage.py makemigrations`

Apply the migrations to create the tables in the database:
`python manage.py migrate`

If you run into an error like "django.db.utils.OperationalError: no such table: ...", run this command:
`python manage.py migrate --run-syncdb`

Then run the following command to add some default data into the database:
`python makedata.py`

### 3. Run the Backend Server
Run the backend server:
`python manage.py runserver`

### 4. Additional Tip
To reset the database:
```
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate --run-syncdb
python makedata.py
```

## <a name="quick-start">--- Quick Start ---</a>

Once both the frontend and backend servers are running locally, you can access the application using the following URLs:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

You can also access our website with the following URLs:

- **Frontend**: [https://www.echolearn.org/](https://www.echolearn.org/)
- **Backend API**: [https:////echolearn.online](https://echolearn.online/api/docs)

## <a name="mobile-section">--- Mobile ---</a>

All of the following commands will be run inside the mobile directory
`cd mobile`

### 1. Install Dependencies
When you clone this repository, install all required npm packages:
`npm install`

Additional Expo libraries needed to build the project, run the following command to install:
`npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`

### 2. Setup Nativewind
Since the styling used is nativewind to set up nativewind run the following command:
`npx expo install nativewind tailwindcss react-native-reanimated`

### 3. Run the Mobile
The mobile app is connect to the deploy backend so you can start the mobil app by running:
`npx expo start -c` 
The -c flag clears the cache. If you do not need to clear the cache, you can omit it.

If you want to run the mobile app with local backend, Please run this code at `/backend` for mobile backend: `python manage.py runserver 0.0.0.0:8000`
and uncomment line 9 at `/mobile/context/globalContext.js` then comment out line 11.

Once the server starts, a QR code will appear at the terminal. Use your phone’s camera or the Expo Go app to scan the QR code and open the mobile application. (iOS preferred)

For more info on using Expo please read over this doc
[Expo](https://docs.expo.dev/router/installation/)


## <a name="deployment">--- Deployment ---</a>
- Purchase 2 domains on namecheap (or other similar service), one for the user-facing frontend website and one for the backend API (which needs it own domain so you can add HTTPS to it we believe?)
- Deploy the frontend via AWS Amplify (we created a separate Git repo to link to Amplify because it wouldn't let us link to GitLab)
- In Amplify, you will want to create an environment variable VITE_API_BASE_URL and set it to the URL of the backend API (In our case, https://echolearn.online)
- You will have to set up a hosted zone using AWS Route 53 to use your custom URL with AWS Amplify (we followed a tutorial online for this)
- Provision an EC2 instance
- Set up the correct NGINX configuration (We followed the instructions from the Web Development 1 class)
- SSH into the EC2 instance and run the following commands to set up the backend server (This is for first time setup, adjust as needed for redeployments):
```
git clone -b dev https://capstone-cs.eng.utah.edu/echolearn/echolearn.git
cd echolearn
cd backend
pip install -r requirements.txt
python3 manage.py collectstatic

# This is to tell our application to use the production endpoint instead of localhost
export DEPLOYED=true

python3 -m pip install pip --upgrade
pip install pyopenssl --upgrade

python3 manage.py makemigrations
python3 manage.py migrate
rm db.sqlite3
python3 manage.py migrate --run-syncdb
python3 makedata.py

nohup python3 manage.py runserver --noreload

# To stop the server (if you need to update something)
kill $(pgrep -f runserver)
```
