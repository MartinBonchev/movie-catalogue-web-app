import { createTheme, ThemeOptions } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { dark } from "@mui/material/styles/createPalette";
import { Interface } from "readline";

const ThemeOptions = require("@mui/material/styles") as Interface;
export const theme: ThemeOptions = createTheme();
