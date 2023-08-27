import { createCourse, getCourseById, getCourses } from "db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  course?: any;
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
    case "GET":
      try {
        const course = await getCourseById({
          courseId: courseId?.toString(),
        });
        console.log(course);
        res.status(200).json({ success: true, course });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(404);
      break;
  }
}
