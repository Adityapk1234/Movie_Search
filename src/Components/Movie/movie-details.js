import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const image_api = "https://image.tmdb.org/t/p/w1280";

const MovieDetails = () => {

	const location = useLocation();
	const navigate = useNavigate();
	const [movieDetail, setMovieDetail] = useState({});

	useEffect(() => {
		if (location.state !== null) {
			setMovieDetail(location.state.data)
		}
		else {
			_navigateBack();
		}
	}, [location])

	const _navigateBack = () => {
		navigate("/");
	}

	return (
		<div className="container">
			<div className="margin-50px-top cursor-pointer d-flex align-items-center "
				onClick={_navigateBack}>
				<i class="fas fa-arrow-left" />
				<span className="margin-10px-left" >Go back</span>
			</div>
			<div className="row d-flex align-items-center movieDetails row-gap-20px">
				<div className="col-md-4">
					<img
						src={`${image_api}${movieDetail.poster_path}`}
						alt={movieDetail.title}
						className="w-100"
					/>
				</div>
				<div className="movieDetails-info col-md-8">
					<h3>
						<b>Title :</b> {movieDetail.title}
					</h3>
					<p>
						<b>Release Date :</b> {movieDetail.release_date}
					</p>
					<p>
						<b>Popularity :</b> {movieDetail.popularity}
					</p>
					<p>
						<b>Overview :</b> {movieDetail.overview}
					</p>
				</div>
			</div>
		</div>
	);
};

export default MovieDetails;
