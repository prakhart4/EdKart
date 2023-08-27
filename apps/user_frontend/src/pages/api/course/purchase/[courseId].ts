import {
  createCourse,
  getCourseById,
  getCourses,
  purchaseCourse,
  removeCourse,
} from "db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data?: any;
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    method,
    headers,
    body,
    query: { courseId = "" },
  } = req;

  const userId = headers["x-user-id"]?.toString() ?? "";

  switch (method) {
    case "POST":
      try {
        const message = await purchaseCourse({
          courseId: courseId?.toString(),
          userId,
        });
        console.log(message);
        res.status(200).json({ success: true, message });
      } catch (error: any) {
        console.log(error);
        res.status(400).json({ success: false, message: error });
      }
      break;
    case "DELETE":
      try {
        const message = await removeCourse({
          courseId: courseId?.toString(),
          userId,
        });
        console.log(message);
        res.status(200).json({ success: true, message });
      } catch (error: any) {
        console.log(error);
        res.status(400).json({ success: false, message: error });
      }
      break;
    default:
      res.status(404);
      break;
  }
}
