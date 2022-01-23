import { useEffect, useState } from "react";
import "./App.css";
import queryString from "query-string";
import axios from "axios";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // each time the app runs, check to see if we have the code for the user to log into Google
  useEffect(() => {
    // extracting the query string into elements ... {code: "9382983", }
    const parsed = queryString.parse(window.location.search);

    // retrieving the tokens from the code
    const code = parsed.code;

    if (!isSignedIn && code) {
      axios
        .post("http://localhost:3001/get-user-account", {
          code: code,
        })
        .then(function (response) {
          // if we have an email, we have signed in to Google
          if (response.data.data.email) {
            // get out of homepage
            setIsSignedIn(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          setIsSignedIn(false);
        });
    }
  }, []);

  const handleClickGetAvailability = async () => {
    try {
      const response = await axios.get('http://localhost:3001/availability');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      {!isSignedIn ? (
        <div>
          <header>
            <div className="w-25 m-3 mx-auto">
              <img
                id="logo"
                className="img-fluid rounded mx-auto d-block"
                src="https://images.emojiterra.com/twitter/v13.1/512px/1f4c5.png"
              />
            </div>
            <h2 className="display-1 text-center">CalAvail</h2>
          </header>

          <div className="col text-center mt-5 btn-lg">
            <form action="http://localhost:3001/sign-in">
              <button className="btn btn-primary ">Sign In!</button>
            </form>
          </div>

          <footer className="text-center mt-5">
            <p>Made with love. Github</p>
          </footer>
        </div>
      ) : (
        <div className="text-center mt-3">
          <h1>Get availability</h1>
          <p>Gets your availability between 9-5 for the next 2 weeks on your main calendar. More features soon to come!</p>
          <div className="container mt-4">
            <button type="button" className="btn btn-info" onClick={handleClickGetAvailability}>
              Go!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
