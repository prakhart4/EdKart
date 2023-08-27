import { AppBarComponent } from "@/components/AppBarComponent";
import { DrawerComponent } from "@/components/DrawerComponent";
import { Box, LinearProgress, Toolbar } from "@mui/material";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { coursesLoadingState, userLoadingState } from "store";
import { Main } from "ui";
import Router from "next/router";

export default function Layout({ children }: { children: React.JSX.Element }) {
  const [open, setOpen] = useState<boolean>(true);
  const isUserLoading = useRecoilValue(userLoadingState);
  const isCoursesLoading = useRecoilValue(coursesLoadingState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  Router.events.on("routeChangeStart", () => {
    setIsLoading(true);
    console.log("routeChangeStart");
  });
  Router.events.on("routeChangeComplete", () => {
    setIsLoading(false);
    console.log("routeChangeComplete");
  });
  Router.events.on("routeChangeError", () => {
    setIsLoading(false);
    console.log("routeChangeError");
  });

  return (
    <>
      <AppBarComponent title="EdKart" open={open} setOpen={setOpen} />
      <DrawerComponent open={open} />
      <Main open={open}>
        <Toolbar />
        {(isLoading || isUserLoading || isCoursesLoading) && (
          <Box position={"relative"}>
            <LinearProgress
              sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
              color="primary"
              variant="indeterminate"
            />
          </Box>
        )}
        {children}
      </Main>
    </>
  );
}
