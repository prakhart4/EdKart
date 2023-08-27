import { Box, Button, Typography } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { useRecoilValue } from "recoil";
import { userNameState } from "store";

function capitalizeFirstLetter(str?: String) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function WelcomeBar() {
  function getGreeting() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good night";
    }
  }

  const userName = useRecoilValue(userNameState);
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      marginTop={2}
      padding={2}
    >
      <Typography variant="h4">
        {getGreeting()} {capitalizeFirstLetter(userName)}
      </Typography>
      <Button startIcon={<CalendarToday />} color="inherit">
        {new Date().toLocaleString(undefined, {
          year: "numeric",
          month: "long",
        })}
      </Button>
    </Box>
  );
}
