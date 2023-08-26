import type { NextApiRequest, NextApiResponse } from "next";
import { signInUser } from "db";

type Data = {
  user?: any;
  token?: string;
  error?: any;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const result = await signInUser({
          email: body.email,
          password: body.password,
          isAdmin: true, // true for admin_frontend api
        });
        console.log("from api/user/signIn try", result);
        res.status(200).json(result);
      } catch (error: any) {
        console.log("from api/user/signIn catch", error.error.message);
        res.status(400).json(
          error
          // {
          //   message: error.message,
          //   error: { message: error.error.message },
          // }
        );
      }
      break;
    default:
      res.status(404).json({ error: { message: "not found" } });
      break;
  }
}
