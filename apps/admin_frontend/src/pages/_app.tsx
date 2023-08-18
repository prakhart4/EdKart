import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "ui";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </RecoilRoot>
  );
}