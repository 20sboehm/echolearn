# Tips

## --- Usage

Start BOTH the frontend server from /frontend (`npm run dev`) and the backend server from /backend (`python manage.py runserver`) then visit this URL to view a card with a particular ID:
http://localhost:5173/cards/{card_id}

## --- Example links and markdown ---

https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2wzdnhhYmE5bzhrZDVncTVpczJnbXluZnkzMDQzeG5wOG9jbXd0cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lXiRm5H49zYmHr3i0/giphy.gif
https://upload.wikimedia.org/wikipedia/commons/e/eb/Ash_Tree_-_geograph.org.uk_-_590710.jpg
https://shorturl.at/rCOHA
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

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

Add dependencies to requirements.txt so that other people can easily download them
`pip freeze > requirements.txt`

Install dependencies from requirements.txt
`pip install -r requirements.txt`

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

If you run into an error like "django.db.utils.OperationalError: no such table: ...", run this command:
`python manage.py migrate --run-syncdb`

Reset the database:
```
python manage.py makemigrations
rm db.sqlite3
python manage.py migrate
python makedata.py
```

python manage.py makemigrations
rm db.sqlite3
python manage.py migrate
python makedata.py

// Run just the bottom 3 commands to reset your data ^


^^^ IF THIS GIVES YOU THE ERROR ALONG THE LINES OF: "It is impossible to add the field 'created_at' with 'auto_now_add=True' to card without providing a default. This is because the database needs something to populate existing rows."

-> This means that there is an unapplied migration file that is based off the old models.py, meaning it is trying to add incomplete rows
    -> Simply delete the most recent migrations file under `migrations` (NOT `__init__.py` or anything in `__pycache`!!) then run the 4 commands above again


Reset the database (use as a backup if the above does not work - FIRST MAKE SURE YOU AREN'T GETTING THE ERROR DIRECTLY ABOVE THIS ^^^):
```
python manage.py makemigrations
python manage.py migrate
rm db.sqlite3
python manage.py migrate --run-syncdb
python makedata.py
```

On EC2
```
python3 manage.py makemigrations
python3 manage.py migrate
rm db.sqlite3
python3 manage.py migrate --run-syncdb
python3 makedata.py
```