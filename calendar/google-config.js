import { google } from "googleapis";
// google = require('googleapis');
//require('dotenv').config()

import * as dotenv from "dotenv";
dotenv.config();

/*
Google's OAuth Lifecycle
// Helpful resources:
// See https://medium.com/@jackrobertscott/how-to-use-google-auth-api-with-node-js-888304f7e3a0
// Also see checked answer on a great overview of OAuth 2.0 -- https://stackoverflow.com/questions/12909332/how-to-logout-of-an-application-where-i-used-oauth2-to-login-with-google


*/

let REFRESH_TOKEN = null;


/*******************/
/** CONFIGURATION **/
/*******************/

// Taken from the .env file.
export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: process.env.GOOGLE_REDIRECT, // this must match your google api settings
};

// This scope tells google what information we want to request from the user. This can give errors if we try to access info that we don't have the proper scope too.
const defaultScope = ["https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/calendar.events.readonly", 'https://www.googleapis.com/auth/plus.me',
'https://www.googleapis.com/auth/userinfo.email',];

/*************/
/** HELPERS **/
/*************/

// Create the google auth object which gives us access to talk to google's apis.
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

// Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope,
  });
}

// Verify that user is still logged in. If we can still get the access token, we are good!
export async function isUserLoggedIn() {
    const auth = createConnection();
    return await auth.getAccessToken();
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
export function urlGoogle() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

// get oauth2 api
function getOAuth2(auth) {
    return google.oauth2({
        auth: auth,
        version: 'v2'
    });
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
export async function getGoogleAccountFromCode(code) {
  const auth = createConnection();
  const { tokens } = await auth.getToken(code);
  REFRESH_TOKEN = tokens.refresh_token;
  auth.setCredentials(tokens);
  const user = getOAuth2(auth);
  const userObject = await user.userinfo.get();
  return userObject;
}


///////////////////////////////////


export async function getCalendar() {
  const authObject = createConnection().setCredentials({refresh_token: REFRESH_TOKEN});

  const calendar = google.calendar('v3');
  const response = await calendar.calendarList.list({
    auth: authObject
  });
  return response;
}