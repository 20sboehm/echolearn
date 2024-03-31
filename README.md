# Tips

## --- Usage

Start BOTH the frontend server from /frontend (`npm run dev`) and the backend server from /backend (`python manage.py runserver`) then visit this URL to view a card with a particular ID:
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

### --- Tailwind CSS ---

VSCode Extensions:
"Tailwind CSS IntelliSense"
"PostCSS Language Support" - To remove warnings on @tailwind

Run these commands:
`npm install -D tailwindcss postcss autoprefixer`
`npx tailwindcss init -p`

## --- Backend ---

Generate migration files based on models:
`python manage.py makemigrations`

Apply the migrations to create the tables in the database:
`python manage.py migrate`

Run the backend server (from /backend):
`python manage.py runserver`

Install cors headers:
`python -m pip install django-cors-headers`

Install django ninja:
`pip install django-ninja`

Reset the database:
```
// generates migration files based on changes you've made to your models. It does not actually affect the database; it just prepares the instructions needed to update the database schema
python manage.py makemigrations

// deletes the SQLite database file - all data will be removed
rm db.sqlite3

// applies the migrations to the database - since we've deleted db.sqlite3, it will create a new database file from scratch based off current migration files
python manage.py migrate

// populate database with data from custom script
python makedata.py
```

^^^ IF THIS GIVES YOU THE ERROR ALONG THE LINES OF: "It is impossible to add the field 'created_at' with 'auto_now_add=True' to card without providing a default. This is because the database needs something to populate existing rows."

-> This means that there is an unapplied migration file that is based off the old models.py, meaning it is trying to add incomplete rows
    -> Simply delete the most recent migrations file under `migrations` (NOT `__init__.py` or anything in `__pycache`!!) then run the 4 commands above again


Reset the database (use as a backup if the above does not work - FIRST MAKE SURE YOU AREN'T GETTING THE ERROR DIRECTLY ABOVE THIS ^^^):
```
// generate migration files
python manage.py makemigrations

// applies migration files to database
python manage.py migrate

// remove database file
rm db.sqlite3

// not sure how this works? migrate should do everything that this does without --run-syncdb. maybe just try migrate by itself first.
python manage.py migrate --run-syncdb

// run custom script to add data
python makedata.py
```
