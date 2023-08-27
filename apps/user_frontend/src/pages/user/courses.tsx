import { userState } from "store";
import { api } from "@/util/api";
import { Box, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CourseCard } from "ui";

type Props = {};

export default function UserCourses({}: Props) {
  const [userAtom, setUserAtom] = useRecoilState(userState);

  useEffect(() => {
    api
      .get("/user")
      .then(
        (res) => {
          console.log(res);

          if (res.status === 200)
            setUserAtom({ isLoading: false, user: res.data.user });
        },
        (error) => {
          console.log(error);
        }
      )
      .finally(() => {
        console.log("finally");
      });
  }, [setUserAtom]);

  return (
    <Container>
      <Box paddingX={1} paddingY={1} alignItems={"center"} display={"flex"}>
        {/* <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton> */}
        <Typography variant="h4" margin={2}>
          My Courses
        </Typography>
      </Box>
      <Grid padding={2} container>
        {userAtom.user?.purchasedCourses?.map((course, index) => (
          <CourseCard
            course={course}
            key={course.title + index}
            showPrice={false}
          />
        ))}
      </Grid>
    </Container>
  );
}

UserCourses.getLayout = true;
