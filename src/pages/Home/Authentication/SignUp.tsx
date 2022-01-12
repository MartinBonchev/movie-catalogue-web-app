import { FormControl, Input, InputLabel, Typography } from "@mui/material";
import { Button, Container } from "components";
import React, { useState } from "react";
import "./SignUp.css";
interface SignUpProps {}

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

export const SignUp: React.FC<SignUpProps> = ({}) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    passwordCheck: "",
  });

  const [formValidity, setFormValidity] = useState({
    email: true,
    password: true,
    passwordCheck: true,
  });

  function checkData({
    email,
    password,
    passwordCheck,
  }: {
    email: string;
    password: string;
    passwordCheck: string;
  }) {
    setFormValidity({ email: true, password: true, passwordCheck: true });
    if (!checkEmail(email))
      setFormValidity((prevState) => ({ ...prevState, email: false }));
    if (!checkPassword(password))
      setFormValidity((prevState) => ({ ...prevState, password: false }));
    if (checkPasswordCheck(passwordCheck))
      setFormValidity((prevState) => ({ ...prevState, passwordCheck: false }));
  }

  function checkEmptyForm(data: {
    email: string;
    password: string;
    passwordCheck: string;
  }) {
    const values: string[] = Object.values(data);
    return !values.every((el) => el.length > 0);
  }

  function checkEmail(email: string) {
    return emailPattern.test(email);
  }

  function checkPassword(password: string) {
    return passwordPattern.test(password);
  }

  function checkPasswordCheck(password: string) {
    return password !== userData.password;
  }

  function setState(prop: string, state: string) {
    setUserData((prevState) => ({ ...prevState, [prop]: state }));
  }

  return (
    <div className="page-container">
      <Container>
        <Typography variant="h4">Sign Up</Typography>
        <FormControl className="input">
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input
            id="email"
            aria-describedby="Please enter your email"
            onChange={(emailValue) => {
              setState("email", emailValue.target.value);
            }}
          />
          {!formValidity.email ? <p>wrong email</p> : null}
        </FormControl>

        <FormControl className="input">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type="password"
            id="password"
            onChange={(passwordValue) => {
              setState("password", passwordValue.target.value);
            }}
          />
          {!formValidity.password ? <p>wrong password</p> : null}
        </FormControl>
        <FormControl className="input">
          <InputLabel htmlFor="password">Confirm Password</InputLabel>
          <Input
            type="password"
            id="password"
            onChange={(passwordCheckValue) => {
              setState("passwordCheck", passwordCheckValue.target.value);
            }}
          />
          {!formValidity.passwordCheck && formValidity.password ? (
            <p>wrong 2 password</p>
          ) : null}
        </FormControl>
        <Button
          onClickHandler={() => {
            checkData(userData);
          }}
          disabled={checkEmptyForm(userData)}
        >
          Register
        </Button>
      </Container>
    </div>
  );
};
