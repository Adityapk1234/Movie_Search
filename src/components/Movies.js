import Movie from "./Movie";

const Movies = (props) => {
  return (
    <>
      {props.movies.map((movie) => (
        <Movie
          key={movie.id}
          movieId={movie.id}
          movie={movie}
          viewMovieInfo={props.viewMovieInfo}
        />
      ))}
    </>
  );
};

export default Movies;
