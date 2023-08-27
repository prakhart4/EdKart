import { coursesState } from "store";
import { userState } from "store";
import { api } from "@/util/api";
import { ArrowBack, VideoCall } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import ObjectID from "bson-objectid";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export default function CoursePage({}) {
  const router = useRouter();
  const userAtom = useRecoilValue(userState);
  const [courseAtom, setCourseAtom] = useRecoilState(coursesState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const course = useMemo(
    () =>
      courseAtom.courses?.find(
        (c) => c._id.toString() === router.query.courseId?.toString()
      ),
    [router.query.courseId, courseAtom.courses]
  );

  useEffect(() => {
    //check if valid objectid
    if (
      !router.query.courseId ||
      !ObjectID.isValid(router.query.courseId.toString())
    )
      return;

    setCourseAtom((prevAtom) => ({
      ...prevAtom,
      isLoading: true,
    }));
    api
      .get(`/course/${router.query.courseId}`)
      .then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            //update current course in courses atom state
            setCourseAtom((prevAtom) => ({
              isLoading: false,
              courses:
                prevAtom.courses?.map((c) =>
                  c._id === response?.data?.course?._id
                    ? response.data.course
                    : c
                ) ?? null,
            }));
          } else {
            setCourseAtom((prevAtom) => ({
              isLoading: false,
              courses: prevAtom.courses,
            }));
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .finally(() => {
        setCourseAtom((prevAtom) => ({
          ...prevAtom,
          isLoading: false,
        }));
      });

    return () => {};
  }, [router.query.courseId, setCourseAtom]);

  const handlePurchaseCourse = () => {
    setIsLoading(true);
    api
      .post(`/course/purchase/${router.query.courseId}`)
      .then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            alert("purchase successful");

            router.push("/");
          } else {
            alert("purchase failed");
          }
        },
        (error) => {
          alert("purchase failed");
          console.log(error);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveCourse = () => {
    setIsLoading(true);
    api
      .delete(`/course/purchase/${router.query.courseId}`)
      .then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            alert("removed successful");

            router.push("/");
          } else {
            alert("remove failed");
          }
        },
        (error) => {
          alert("remove failed");
          console.log(error);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isPurchased = useMemo(
    () =>
      userAtom.user?.purchasedCourses
        .map((u) => u._id)
        .includes(course?._id ?? ""),
    [userAtom.user, course]
  );

  return (
    <>
      <Box paddingX={2} paddingY={1}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
      </Box>
      <Container
        sx={{
          display: "flex",
          padding: 4,
          paddingTop: 0,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Typography my={2} variant="h4">
            {course?.title ?? "Loading.."}
          </Typography>
          <Avatar
            variant="square"
            sx={{ width: "60vh", height: "60vh", objectFit: "cover" }}
            alt={course?.title}
            src={course?.imageLink}
          >
            <VideoCall />
          </Avatar>
        </Box>
        <Box flexGrow={1} display={"flex"} flexDirection={"column"} margin={4}>
          <Typography variant="subtitle1">{course?.description}</Typography>
          <Box flexGrow={1} />
          <Typography margin={2}>Price: {course?.price}</Typography>
          <Button
            disabled={isLoading}
            fullWidth
            variant="contained"
            onClick={isPurchased ? handleRemoveCourse : handlePurchaseCourse}
          >
            {isPurchased ? "Remove" : "Buy"}
          </Button>
        </Box>
      </Container>
    </>
  );
}

CoursePage.getLayout = true;
