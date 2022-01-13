import { Button } from "components";
import React from "react";
import "./Movie.css";

interface MovieProps {
  src: string;
  title: string;
  date: string;
  genres: string[];
  duration: number;
  overview: string;
  officialSitePath: string;
}

export const Movie: React.FC<MovieProps> = ({
  src,
  title,
  date,
  genres,
  duration,
  overview,
  officialSitePath,
}) => {
  const getYear = (date: string) => {
    const year = new Date(date).getFullYear();
    return year;
  };

  return (
    <div className="movie-container">
      <img
        height={300}
        width={200}
        src={`https://image.tmdb.org/t/p/w500${src}`}
      />
      <div className="description-section">
        <h1>
          {title} ({getYear(date)})
        </h1>
        <p>
          {genres.join(", ")} | {duration} minutes
        </p>
        <p>{overview}</p>
        <a href={officialSitePath}>Visit official site</a>
        <Button onClickHandler={() => {}}>Add to favourites</Button>
        <Button color="error" onClickHandler={() => {}}>
          Remove from favourites
        </Button>
      </div>
    </div>
  );
};
