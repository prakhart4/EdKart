import { getUserById } from "db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data?: any;
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, headers } = req;

  const userId = headers["x-user-id"]?.toString() ?? "";

  switch (method) {
    case "GET":
      try {
        const user = await getUserById({
          userId,
        }); /* find all the data in our database */
        console.log(user);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
