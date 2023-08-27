import { coursesState } from "../atoms/course";
import { selector } from "recoil";

export const coursesLoadingState = selector({
  key: "coursesLoadingState",
  get: ({ get }) => {
    const state = get(coursesState);

    return state.isLoading;
  },
});
