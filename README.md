# Lunchroom

Built with React and Express

# Developer Setup

1. Clone this repository with `git` in whichever way you are most comfortable with
(Make sure you will be able to push later)  
2. Make sure that you have Node.js installed on your computer or [install it here](https://nodejs.org/en/download/)  
3. Open up the directory/folder in Terminal, Powershell, or Command Prompt and run `npm i` to install dependencies.  
4. Create a file named `.env` at the root of the project and insert the environment variables into it in the
format `VARIABLE_NAME=VARIABLE_VALUE`.  
   * A `template.env` has been provided with the keys you need to fill out or change
5. Start the frontend with `npm start` or the backend with `nodemon server`  
   * The script should then automatically restart itself whenever changes are detected.

# Git Pull + create new branch

To ensure you are always creating a new branch with the most recent version of the dev branch, run this
command `git branch local-branch origin/dev`.   
This copies the entire dev branch on this GitHub repo onto a new local branch. To work on that branch,
run `git checkout local-branch`. Work on your task here.   
Every time you do this, it is a good idea to run `npm install` in both the lunchroom folder and the backend
folder (`cd backend`)

### Linting
To lint the frontend, run the following command:

```npm run lint```

To run the linter and fix all the errors, run the following command:

```npm run lint:fix```