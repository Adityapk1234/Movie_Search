import React from "react";

const image_api = "https://image.tmdb.org/t/p/w1280";

const MovieCard = (props) => {

  return (
    <>
      <div className="movie cursor-pointer position-relative">
        <img
          src={image_api + props.movie.poster_path}
          alt={props.movie.title}
          onClick={() => props.viewMovieInfo(props.movie)} />
        <img src={props.movie.favourite ? require("../../Assets/Images/color-heart.png") : require("../../Assets/Images/heart.png")}
          alt="Heart"
          width={24}
          height={24}
          draggable={false}
          className="position-absolute end-0 top-0 h-fit-content bg-white"
          onClick={() => props.handleFavourite(props.movie)} />
        <div className="movie-info">
          <h3>{props.movie.title}</h3>
          <h3>{props.movie.release_date}</h3>
          <p>{props.movie.overview}</p>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
