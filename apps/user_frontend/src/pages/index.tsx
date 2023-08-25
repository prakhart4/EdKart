import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import { getIdFromToken, getUserById } from "db";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token || ""; // Extract the 'token' cookie

  // console.log("token=====", token);

  try {
    const userId = await getIdFromToken(token);

    const result = await getUserById({ userId: userId });

    return { props: { user: JSON.parse(JSON.stringify(result)) } };
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
  // const { push } = useRouter();

  useEffect(() => {
    console.log("7070", user);
    setUser({ user, isLoading: false });

    return () => {};
  }, [user]);

  return <Dashboard />;
}

Home.getLayout = true;
