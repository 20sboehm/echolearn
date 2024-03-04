# Tips

## --- Usage

Start BOTH the frontend server (`npm run dev`) and the backend server (`python manage.py runserver`) then visit this URL to view a card with a particular ID:
http://localhost:5173/cards/{card_id}

## --- Frontend ---

Create app using vite:
`npx create-vite my-react-app --template react`

When you first pull down this repo run npm install (npm packages are in gitignore):
`cd frontend`
`npm install`

Run the frontend server (from /frontend):
`npm run dev`

Install react-query:
`npm install react-query`

Install react-router-dom:
`npm install react-router-dom`

## --- Backend ---

Generate migration files based on models:
`python manage.py makemigrations`

Apply the migrations to create the tables in the database:
`python manage.py migrate`

Run the backend server:
`python manage.py runserver`

Instal cors headers:
`python -m pip install django-cors-headers`