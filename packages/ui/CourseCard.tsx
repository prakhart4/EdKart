import { Course } from "store";
import { VideoCall } from "@mui/icons-material";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export const CourseCard = ({
  course,
  showPrice = true,
}: {
  course: Course;
  showPrice?: boolean;
}) => {
  const { push } = useRouter();
  return (
    <Grid
      // ref={Books.length - 4 === index ? lastBookElementRef : undefined}
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
    >
      <Card
        onClick={() => push(`/courses/${course._id}`)}
        sx={{
          height: "100%",
          bgcolor: "inherit",
          paddingY: { xs: 1, sm: 4, md: 6 },
          paddingX: 2,
        }}
        variant="outlined"
      >
        <Avatar
          sx={{ objectFit: "contain", height: "240px", width: "100%" }}
          variant="square"
          alt={course.title}
          src={course.imageLink}
        >
          <VideoCall />
        </Avatar>
        <CardContent
          sx={{
            textAlign: "center",
            padding: 0,
            "&:last-child": {
              paddingBottom: 0,
            },
          }}
        >
          <Typography gutterBottom variant="body1" component="h2">
            {course.title}
          </Typography>
          {typeof course?.author !== "string" && course?.author?.name && (
            <Typography variant="body2" mb={2}>
              by <b>{course?.author?.name}</b>
            </Typography>
          )}
          {showPrice && (
            <Typography variant="body2" color="#B12704">
              Price: Rs{course.price}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};
