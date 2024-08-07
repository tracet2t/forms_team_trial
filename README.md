# Creating a to-do application using React for the frontend and SQLite for the backend.

* Here's an outline of what we'll build

## Frontend (React)
A simple interface to display, add, edit, and delete to-do items.

## Frontend: React Setup
Set Up React App
npx create-react-app app-name
cd app-name

use npm install

Install Dependencies - npm install axios


## Backend (Express)
A server that handles CRUD operations for to-do items and interacts with the SQLite database.

## Backend : Express Setup
* npm install express sqlite3 

" Add the following line to package.json in the React app to proxy requests to the backend "

"proxy": "http://localhost:5000",

## Database (SQLite)
A database to store the to-do items

## Start the Server

cd backend
node server.js

## Start the React App
cd todo-app
npm start



