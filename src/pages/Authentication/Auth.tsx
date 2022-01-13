import { FormControl, Input, InputLabel, Typography } from "@mui/material";
import "./Auth.css";
import { Button, Container } from "components";
import React, { useState } from "react";
import { useAppDispatch } from "__hooks__/redux";
import { createUserThunk, loginUserThunk } from "../../redux/slices/authSlice";
import { auth } from "firebase.config";
interface AuthProps {}

interface FieldData {
  email: string;
  password: string;
  passwordCheck: string;
}

interface FormValidity {
  email: boolean;
  password: boolean;
  passwordCheck: boolean;
}

interface FormValidator {
  email: (value: string) => boolean;
  password: (value: string) => boolean;
  passwordCheck: (value: string) => boolean;
}

type FormKeys = "email" | "password" | "passwordCheck";

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const Auth: React.FC<AuthProps> = ({}) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
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

  const formVaidatorMap: FormValidator = {
    email: checkEmail,
    password: checkPassword,
    passwordCheck: checkPasswordCheck,
  };

  const checkFieldsValidity = (data: any) => {
    const keyValuePairs: [any, any][] = Object.entries(data);
    if (isRegisterMode()) keyValuePairs.splice(keyValuePairs.length - 1, 1);
    keyValuePairs.forEach((el: [FormKeys, any]) => {
      const key: FormKeys = el[0];
      const value = el[1];
      const pred: (value: string) => boolean = formVaidatorMap[key];
      setFormValidity((prevState: FormValidity) => ({
        ...prevState,
        [key]: pred(value),
      }));
    });
  };

  async function signup({ email, password }: FieldData) {
    if (checkFormValidity(formValidity)) {
      try {
        const res: any = await dispatch(
          createUserThunk({ email: email, password: password })
        );
        writeInLocalStorage(res);
        if (res.error) setError(res.error.message);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }

  function checkFormValidity(obj: FormValidity) {
    return checkValues(obj, (e: boolean) => e === true);
  }

  async function signin({ email, password }: FieldData) {
    if (checkFormValidity(formValidity)) {
      try {
        const res: any = await dispatch(
          loginUserThunk({ email: email, password: password })
        );
        if (res.error) setError(res.error.message);
        writeInLocalStorage(res);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }

  function writeInLocalStorage(res: any) {
    localStorage.setItem("email", res.payload.user.email);
    localStorage.setItem("uid", res.payload.user.uid);
  }

  function isEmptyForm(data: FieldData) {
    return checkValues(data, (e: string) => e.length > 0);
  }

  function isRegisterMode() {
    return mode === "register" ? true : false;
  }

  function checkValues(
    obj: FormValidity | FieldData,
    pred: (e: any) => boolean
  ) {
    const value = Object.values(obj);
    value.splice(value.length - 1, 1);
    return value.every(pred);
  }

  function checkEmail(value: string) {
    return emailPattern.test(value);
  }

  function checkPassword(value: string) {
    return passwordPattern.test(value);
  }

  function checkPasswordCheck(value: string) {
    return userData.password === value;
  }

  function setState(fieldName: string, state: string) {
    setUserData((prevState: FieldData) => ({
      ...prevState,
      [fieldName]: state,
    }));
  }

  function changeMode() {
    setMode((prevState) => (prevState === "register" ? "login" : "register"));
  }

  function authenticate(userData: FieldData) {
    if (isRegisterMode()) signup(userData);
    else signin(userData);
  }

  return (
    <div className="page-container">
      <Container>
        <Typography variant="h4">
          {isRegisterMode() ? "Sign Up" : "Login"}
        </Typography>
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
        {isRegisterMode() ? (
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
        ) : (
          <></>
        )}
        <Button
          onClickHandler={() => {
            checkFieldsValidity(userData);
            authenticate(userData);
          }}
          // disabled={!isEmptyForm(userData)}
        >
          {isRegisterMode() ? "Register" : "Login"}
        </Button>
        <Button color="primary" onClickHandler={changeMode}>
          {isRegisterMode() ? "Login" : "Register"}
        </Button>
        <p>{error || ""}</p>
      </Container>
    </div>
  );
};
