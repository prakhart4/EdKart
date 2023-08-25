import type { NextApiRequest, NextApiResponse } from "next";
import { signInUser } from "db";

type Data = {
  user?: any;
  token?: string;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const result = {};
        // await signInUser({
        //   email: body.email,
        //   password: body.password,
        //   isAdmin: body.isAdmin,
        // });
        console.log(result);
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(400).json({ error });
      }
      break;
    default:
      res.status(404).json({ error: { message: "not found" } });
      break;
  }
}
