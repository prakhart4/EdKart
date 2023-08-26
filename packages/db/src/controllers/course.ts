import mongoose from "mongoose";
import { Course } from "../models/course";
import { User } from "../models/user";
import { dbConnect } from "../lib/dbConnect";

/**
 * Get recommended courses for a user, i.e. courses that user has not purchased
 * @param userId user's _id in string form
 * @returns array of courses
 */
export const getCourses = async ({ userId }: { userId: string }) => {
  await dbConnect();
  const courses = await Course.find({ published: true });
  //   res.json({ courses });
  if (courses) {
    const user = await User.findOne({ _id: userId });
    if (user) {
      const recommendedCourses = courses.filter(
        (course) => !user.purchasedCourses.includes(course._id)
      );
      console.log(recommendedCourses);
      return recommendedCourses;
    } else {
      console.log(courses);
      return courses;
    }
  } else {
    throw new Error("No courses found");
  }
};

/**
 * Get course by its ID
 * @param courseId course's _id in string form
 * @returns course object
 */
export const getCourseById = async ({ courseId }: { courseId: string }) => {
  await dbConnect();
  const course = await Course.findById(courseId);
  if (course) {
    return course;
  } else {
    throw Error("Course not found");
  }
};

/**
 * Purchase a course with course ID and user ID
 * @param courseId Course that the user wants to purchase
 * @param userId User that wants to purchase the course
 * @returns Success message or error message in string
 */
export const purchaseCourse = async ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  await dbConnect();
  //check if valid objectId
  if (!mongoose.isValidObjectId(courseId))
    throw new Error(courseId + " is not a valid id");

  const course = await Course.findById(courseId);

  if (course) {
    const user = await User.findOne({ _id: userId });
    if (user && !user.purchasedCourses.includes(course._id)) {
      user.purchasedCourses.push(course._id);
      await user.save();
      return "Course purchased successfully";
    } else {
      throw new Error("Course already purchased");
    }
  } else {
    throw new Error("Course not found");
  }
};

/**
 * Remove/return a purchased course for a user
 * @param courseId Course that the user wants to purchase
 * @param userId User that wants to purchase the course
 * @returns Success message or error message in string
 */
export const removeCourse = async ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  await dbConnect();
  if (!mongoose.isValidObjectId(courseId))
    throw new Error(courseId + " is not a valid id");

  const course = await Course.findById(courseId);

  console.log("hi");

  if (course) {
    const user = await User.findOne({ _id: userId });
    if (user && user.purchasedCourses.includes(course._id)) {
      user.purchasedCourses.splice(
        user.purchasedCourses.indexOf(course._id),
        1
      );
      await user.save();
      return "Course removed successfully";
    } else {
      throw new Error("Course not purchased");
    }
  } else {
    throw new Error("Course not found");
  }
};

/**
 * Create a course, which is only allowed for admin users
 * @param title Course title
 * @param description Course description
 * @param imageLink Course image url
 * @param price Course price
 * @param userId User's _id
 * @returns Course object if successful, string error message if failed.
 */
export const createCourse = async ({
  title,
  description,
  imageLink,
  price,
  userId,
}: {
  title: string;
  description: string;
  imageLink: string;
  price: string;
  userId: string;
}) => {
  //   const { title, description, imageLink, price, userId } = req.body;

  await dbConnect();
  if (!title || !description || !imageLink || !price || !userId) {
    throw new Error("All fields are required");
  }

  //check if user is admin
  const user = await User.findOne({ _id: userId });

  if (!user?.isAdmin) {
    throw new Error("Only admin can create course");
  }

  const course = new Course({
    title,
    description,
    imageLink,
    price,
    author: userId,
    published: true,
  });
  await course.save();
  return course;
};
