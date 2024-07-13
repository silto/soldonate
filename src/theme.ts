"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#106ECC",
    },
    secondary: {
      main: "#ff7005",
    },
    error: {
      main: "#ef0e0e",
    },
    background: {
      paper: "#1a1a1a",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "#ffffff",
            transition: "background-color 5000s ease-in-out 0s",
            boxShadow: "inset 0 0 20px 20px #23232329",
          },
        },
      },
    },
  },
});

export default theme;
