import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Typography, TextField } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { loginUserThunk } from "redux/slices/authSlice";
import { useAppDispatch } from "__hooks__/redux";

import { Button } from "components";
import { passwordPattern } from "utils/passwordPattern.utils";

interface FormState {
  email: string;
  password: string;
}

const formSchema = yup.object().shape({
  email: yup.string().email().required("This field is required!"),
  password: yup
    .string()
    .min(6, "your password should be at least 6 symbols long")
    .max(20, "your password should be max 20 symbols long")
    .matches(
      passwordPattern,
      "the password should contain at least one number, one uppercase symbol, one lowercase symbol and one special symbol"
    )
    .required("This field is required!"),
});

export const SignIn: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormState>({ resolver: yupResolver(formSchema) });
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");

  const authenticate: SubmitHandler<FormState> = async ({
    email,
    password,
  }: FormState) => {
    try {
      const res: any = await dispatch(
        loginUserThunk({ email: email, password: password })
      );
      if (res.error) setError(res.error.message);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(authenticate)}>
      <Typography variant="h4">Sign in</Typography>
      <div className="form-container">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="email"
              label={"Email"}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email ? errors.email?.message : ""}
              value={getValues("email") || ""}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password ? errors.password?.message : ""}
              value={getValues("password") || ""}
            />
          )}
        />
        <Button className="submit-button" type="submit">
          Submit
        </Button>
      </div>
      <p>{error}</p>
    </form>
  );
};
