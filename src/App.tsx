import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material";

import Routes from "Routes";
import { useAppDispatch } from "__hooks__/redux";
import { setUser } from "redux/slices/authSlice";
import { theme } from "styles/theme";
import { auth } from "firebase.config";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const [firebaseAuthTrigger, setFirebaseAuthTrigger] = useState(false)
  
  auth.onAuthStateChanged((userCredentials) => {
    setFirebaseAuthTrigger(true)
    if (userCredentials) {
      dispatch(
        setUser({ email: userCredentials.email, user_id: userCredentials.uid })
      );
    }
  });

  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {firebaseAuthTrigger ? <Routes /> : null}
      </ThemeProvider>
    </Router>
  );
}

export default App;
