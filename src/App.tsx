import { Header } from "containers";
import { SignUp } from "pages/Home/Authentication/SignUp";
import { Home } from "pages/Home/Dashboard/Home";
import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div>
      {/* <Header /> */}

      <Routes>
        <Route path="/" element={<SignUp />}></Route>
      </Routes>
    </div>
  );
}

export default App;
