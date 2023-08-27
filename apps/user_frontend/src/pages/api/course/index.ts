import { createCourse, getCourses } from "db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  courses?: any;
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, headers, body } = req;

  const userId = headers["x-user-id"]?.toString() ?? "";

  switch (method) {
    case "GET":
      try {
        const courses = await getCourses({
          userId,
        });
        console.log(courses);
        res.status(200).json({ success: true, courses });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const courses = await createCourse({
          title: body.title,
          description: body.description,
          imageLink: body.imageLink,
          price: body.price,
          userId,
        });
        console.log(courses);
        res.status(200).json({ success: true, courses });
      } catch (error: any) {
        console.log(error);
        res.status(400).json({ success: false, message: error });
      }
    default:
      res.status(404);
      break;
  }
}
