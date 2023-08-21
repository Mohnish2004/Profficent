Make sure to install these packages:

```
npm i express
npm install -g nodemon
npm i mongoose
npm i body-parser
npm i dotenv
```

To start the backend (Create the .env file first):

```
cd backend
nodemon server
```

Create a .env file on the backend and add in all the Environment Variables from Notion for the backend<br>
Make sure the .env file is listed in your .gitignore file so that we don't push our keys to GitHub!

### Linting
To lint the frontend, run the following command:

```npm run lint```

To run the linter and fix all the errors, run the following command:

```npm run lint:fix```