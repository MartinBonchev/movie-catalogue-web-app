import { MovieState } from "redux/slices/movieSlice";

export const searchByTitle = (keyword: string, list: Array<MovieState>) => {
  return list.filter((el) => {
    return el.title.toLocaleLowerCase().includes(keyword.trim());
  });
};
