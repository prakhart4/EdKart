import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { userState } from "@/store/atoms/user";
import Dashboard from "@/components/Dashboard";
import { getIdFromToken } from "utils";
import { getUserById } from "db";

export const drawerWidth = 240;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token || ""; // Extract the 'token' cookie

  // console.log("token=====", token);

  try {
    const userId = await getIdFromToken(token);

    const result = await getUserById({ userId });

    return {
      props: {
        user: JSON.parse(JSON.stringify(result)),
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

export default function Home({ user }: { user: any }) {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    setUser({ user, isLoading: false });

    return () => {};
  }, [setUser, user]);

  return <Dashboard />;
}

Home.getLayout = true;
