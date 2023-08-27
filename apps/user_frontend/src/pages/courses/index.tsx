import { coursesState } from "store";
import { api } from "@/util/api";
import { Box, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CourseCard } from "ui";

type Props = {};

export default function Courses({}: Props) {
  const [coursesAtom, setCoursesAtom] = useRecoilState(coursesState);

  useEffect(() => {
    setCoursesAtom((prevAtom) => ({
      isLoading: true,
      courses: prevAtom.courses,
    }));
    api
      .get("/course")
      .then(
        (res) => {
          console.log(res);

          if (res.status === 200)
            setCoursesAtom({ isLoading: false, courses: res.data.courses });
        },
        (error) => {
          console.log(error);
          setCoursesAtom({ isLoading: false, courses: null });
        }
      )
      .finally(() => {
        setCoursesAtom((prevAtom) => ({
          isLoading: false,
          courses: prevAtom.courses,
        }));
      });
  }, [setCoursesAtom]);

  return (
    <Container>
      <Box paddingX={1} paddingY={1} alignItems={"center"} display={"flex"}>
        {/* <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton> */}
        <Typography variant="h4" margin={2}>
          All Courses
        </Typography>
      </Box>
      <Grid padding={2} container>
        {coursesAtom.courses?.map((course, index) => (
          <CourseCard course={course} key={course.title + index} />
        ))}
      </Grid>
    </Container>
  );
}

Courses.getLayout = true;
