import React from "react";

const image_api = "https://image.tmdb.org/t/p/w1280";

const Movie = (props) => {
  return (
    <>
      <div className="movie">
        <img
          src={image_api + props.movie.poster_path}
          alt={props.movie.title}
          onClick={() => props.viewMovieInfo(props.movieId)}
        />
        <div className="movie-info">
          <h3>{props.movie.title}</h3>
          <h3>({props.movie.vote_average})</h3>
        </div>
        <p>{props.movie.overview}</p>
      </div>
    </>
  );
};

export default Movie;
