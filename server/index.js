/*
Initialize Express server

Run server by typing: "npm start" in terminal
*/

// const urlGoogle = require("../calendar/google-config.js");
import { urlGoogle, getGoogleAccountFromCode, getCalendar } from '../calendar/google-config.js';

// import express
//const express = require("express");
import express from "express";

import cors from 'cors';


// See https://stackoverflow.com/questions/18864677/what-is-process-env-port-in-node-js
const PORT = process.env.PORT || 3001;

const app = express();

// See https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded#:~:text=a.-,express.,application%20using%20the%20code%3A%20app.
app.use(express.json());
// See https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express
app.use(cors())


/**
 * ROUTES
 */

/** AUTH */
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Signs the user in
app.get("/sign-in", (req, res) => {
    // redirects the user to Google OAuth's 2.0 Module
    res.redirect(301, urlGoogle())
});

// Gets the user account from the Google
app.post("/get-user-account", (req, res) => {
    getGoogleAccountFromCode(req.body.code).then( (user) => {
        console.log(user);
        res.json(user);
    });
});



/**
 * GOOGLE CALENDAR API
 */

// Get all events
app.get("/availability", (req, res) => {
  getCalendar().then((calenders) => {
    res.json(calenders);
  })
});


// Get all free busy time


/** Allow our server to listen on a port for requests from the client. **/
// See https://stackoverflow.com/questions/59835089/why-app-listen-should-be-at-the-end-after-all-the-requests-also-why-is-it-neces
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
