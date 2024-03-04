# Tips

## --- Fronend ---

Create app using vite:
`npx create-vite my-react-app --template react`

When you first pull down this repo run npm install (npm packages are in gitignore):
`cd frontend`
`npm install`

Run the frontend server (from /frontend):
`npm run dev`

## --- Backend ---

Generate migration files based on models:
`python manage.py makemigrations`

Apply the migrations to create the tables in the database:
`python manage.py migrate`

Run the backend server:
`python manage.py runserver`