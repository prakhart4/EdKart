import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import { getCourses, getUserById } from "db";
import { Course, coursesState } from "@/store/atoms/course";
import { getIdFromToken } from "utils";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token || ""; // Extract the 'token' cookie

  // console.log("token=====", token);

  try {
    const userId = await getIdFromToken(token);

    const result = await getUserById({ userId }); //todo try to run them in parallel
    const courses = await getCourses({ userId });

    return {
      props: {
        user: JSON.parse(JSON.stringify(result)),
        courses: JSON.parse(JSON.stringify(courses)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: "/signIn", // Redirect to the signIn page
        permanent: false,
      },
    };
  }
};

export default function Home({
  user,
  courses,
}: {
  user: any;
  courses: Course[];
}) {
  const setUser = useSetRecoilState(userState);
  const setCourse = useSetRecoilState(coursesState);

  useEffect(() => {
    console.log("Setting user and courses: ", { user, courses });
    setUser({ user, isLoading: false });
    setCourse({ courses, isLoading: false });

    return () => {};
  }, [user, courses, setUser, setCourse]);

  return <Dashboard />;
}

Home.getLayout = true;
