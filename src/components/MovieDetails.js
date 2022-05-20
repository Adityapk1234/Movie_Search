const image_api = "https://image.tmdb.org/t/p/w1280";

const MovieDetails = (props) => {
  return (
    <div className="container">
      <div
        className="row"
        onClick={props.closeMovieInfo}
        style={{ cursor: "pointer", paddingTop: 50 }}
      >
        <i class="fas fa-arrow-left" />
        <span style={{ marginLeft: 10 }}>Go back</span>
      </div>
      <div className="movieDetails">
        <img
          src={`${image_api}${props.currentMovie.poster_path}`}
          alt={props.currentMovie.title}
        />
        <div className="movieDetails-info">
          <h3>
            <b>Title :</b> {props.currentMovie.title}
          </h3>
          <p>
            <b>Release Date :</b> {props.currentMovie.release_date}
          </p>
          <p>
            <b>Popularity :</b> {props.currentMovie.popularity}
          </p>
          <p>
            <b>Overview :</b> {props.currentMovie.overview}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
