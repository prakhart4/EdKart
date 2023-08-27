import { userState } from "../atoms/user";
import { selector } from "recoil";

export const purchasedCoursesState = selector({
  key: "purchasedCoursesState",
  get: ({ get }) => {
    const state = get(userState);

    return state.user?.purchasedCourses;
  },
});
