const genres: Record<number, string> = {
  37: "Western",
  10752: "War",
  53: "Thriller",
  10770: "TV Movie",
  878: "Science Fiction",
  10749: "Romance",
  9648: "Mystery",
  10402: "Music",
  27: "Horror",
  36: "History",
  14: "Fantasy",
  18: "Drama",
  10751: "Family",
  99: "Documentary",
  80: "Crime",
  35: "Comedy",
  16: "Animation",
  12: "Adventure",
  28: "Action",
};

export const getGenres = (genreIds: number[]) =>
  genreIds.filter((id) => genres[id] !== undefined).map((id) => genres[id]);
