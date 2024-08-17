import { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { MovieCard } from "../Card";
import { CustomDatePicker, CustomSelectBox, NumberInput, SearchBox } from "../FormElements"

const LISTING_API = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b0fe2be9feecde8c7e0916360eb018ba&page=";
const DATE_RANGE_API = "https://api.themoviedb.org/3/discover/movie&api_key=b0fe2be9feecde8c7e0916360eb018ba&"
const SEARCH_API = "https://api.themoviedb.org/3/search/movie?&api_key=b0fe2be9feecde8c7e0916360eb018ba&query=";
const FILTER_OPTIONS_API = "https://api.themoviedb.org/3/genre/movie/list?&api_key=b0fe2be9feecde8c7e0916360eb018ba"
// https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b0fe2be9feecde8c7e0916360eb018ba&page=1&primary_release_date.gte=2020-10-01&primary_release_date.lte=2020-10-15

const MovieList = (props) => {

	const navigate = useNavigate();
	const [movies, setMovies] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const [initialLoader, setInitialLoader] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [genreOptions, setGenreOptions] = useState([]);
	const [selectedGenre, setSelectedGenre] = useState(null);
	const [dateRange, setDateRange] = useState({ from: null, to: null });
	const [voteCount, setVoteCount] = useState("");
	const [retrievedData, setRetrievedData] = useState([]);

	// http://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=###&page=1&vote_count.gte=50
	function _buildApiUrl({ page, sortBy, apiKey, startDate, endDate, with_genres, vote_count, query }) {
		let baseUrl = 'https://api.themoviedb.org/3/discover/movie';
		if (query) {
			baseUrl = 'https://api.themoviedb.org/3/search/movie'
		}

		const params = new URLSearchParams({
			sort_by: sortBy || 'popularity.desc',
			api_key: apiKey,
			// only include date range if both dates are provided
			...(startDate && endDate ? { 'primary_release_date.gte': startDate, 'primary_release_date.lte': endDate } : {}),
			// only include page if it's provided
			...(page ? { page: page } : {}),
			...(with_genres ? { with_genres: with_genres } : {}),
			...(vote_count ? { vote_count: vote_count } : {}),
			...(query ? { query: query } : {})
		});

		return `${baseUrl}?${params.toString()}`;
	}

	const API_URL = _buildApiUrl({
		page: currentPage,
		sortBy: 'popularity.desc',
		apiKey: 'b0fe2be9feecde8c7e0916360eb018ba',
		startDate: dateRange.from !== null ? _formatDate(dateRange.from) : null,
		endDate: dateRange.to !== null ? _formatDate(dateRange.to) : null,
		with_genres: selectedGenre !== null ? selectedGenre.value : null,
		vote_count: voteCount.length !== 0 ? voteCount : null,
		query: searchTerm.length !== 0 ? searchTerm : null
	});

	useEffect(() => {
		// Retrieve the JSON string from sessionStorage and parse it back into an array
		const storedData = sessionStorage.getItem('favouriteMovies');
		if (storedData) {
			setRetrievedData(JSON.parse(storedData));
		}
	}, []);

	// console.log(API_URL);

	useEffect(() => {
		_getFilterOptions();
	}, []);

	useEffect(() => {
		_getMovieList();
	}, [selectedGenre, selectedGenre]);

	useEffect(() => {
		if (dateRange.from !== null && dateRange.to !== null) {
			_getMovieList();
		}
	}, [dateRange]);

	useEffect(() => {
		if (currentPage > 1) {
			_getMovieList();
		}
	}, [currentPage])

	// search query
	useEffect(() => {
		if (!initialLoader) {
			const debounce_timeout = setTimeout(() => {
				_getMovieList();
			}, 500);

			return () => {
				clearTimeout(debounce_timeout);
			};
		}
	}, [searchTerm]);

	useEffect(() => {
		if (voteCount.length !== 0) {
			const debounce_timeout = setTimeout(() => {
				_getMovieList();
			}, 500);

			return () => {
				clearTimeout(debounce_timeout);
			};
		}
	}, [voteCount]);


	// infinite scroll
	const handleScroll = useCallback(() => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const scrollHeight = document.documentElement.scrollHeight;
		const clientHeight = document.documentElement.clientHeight;

		if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingMore) {
			setCurrentPage(prevPage => prevPage + 1);
		}
	}, [loadingMore]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	// handle search input field
	const _handleOnChange = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	// handle genre select box
	const _handleGenre = (value) => {
		setSelectedGenre(value);
		setCurrentPage(1);
	}

	const handleSelectDate = (range) => {
		setDateRange(range);
		console.log('Selected range:', range);
	};

	function _formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	const _handleVoteCount = (value) => {
		setVoteCount(value);
	};

	const _handleFavourite = (item) => {
		// Check if the item is already in the retrieved list
		const isInRetrievedList = retrievedData.some((data) => data.id === item.id);

		// Update the retrievedData and movies list based on the presence of the item
		let updatedRetrievedData;
		let updatedMovies;

		if (isInRetrievedList) {
			// Remove item from retrievedData
			updatedRetrievedData = retrievedData.filter((data) => data.id !== item.id);

			// Update movies list to mark the item as not favourite
			updatedMovies = movies.map((movie) =>
				movie.id === item.id ? { ...movie, favourite: false } : movie
			);
		} else {
			// Add item to retrievedData
			const itemWithFavourite = { ...item, favourite: true };
			updatedRetrievedData = [...retrievedData, itemWithFavourite];

			// Update movies list to mark the item as favourite
			updatedMovies = movies.map((movie) =>
				movie.id === item.id ? { ...movie, favourite: true } : movie
			);
		}

		// Update the state
		setRetrievedData(updatedRetrievedData);
		setMovies(updatedMovies);

		// Save updatedRetrievedData to sessionStorage
		sessionStorage.setItem('favouriteMovies', JSON.stringify(updatedRetrievedData));
	};

	// API -  movie list based on page number
	const _getMovieList = () => {
		axios
			.get(API_URL)
			.then((response) => {
				const storedData = sessionStorage.getItem('favouriteMovies') || '[]';
				const parsedData = JSON.parse(storedData);

				// Mapping through response data to set the `favourite` property
				const updatedMovies = response.data.results.map(movie => {
					const isFavourite = parsedData.some(item => item.id === movie.id);
					return {
						...movie,
						favourite: isFavourite
					};
				});

				if (currentPage === 1) {
					setMovies(updatedMovies);
				} else {
					setMovies((prevMovies) => [
						...prevMovies,
						...updatedMovies
					]);
				}
				setInitialLoader(false);
				setLoadingMore(false);
			})
			.catch((error) => {
				setLoadingMore(false);
			});
	};

	// API - to get genre filter data
	const _getFilterOptions = () => {
		axios
			.get(`${FILTER_OPTIONS_API}`)
			.then((response) => {
				const transformed_data = response.data.genres.map((item) => ({
					value: item.id,
					label: item.name
				}));

				setGenreOptions(transformed_data)
			})
			.catch((error) => {
				setLoadingMore(false);
			});
	};

	// movie detail
	const _viewMovieInfo = (movie) => {
		navigate("detail", {
			state: {
				data: movie
			}
		})
	};

	return (
		<Fragment>
			<div className="row my-4 row-gap-16px">
				<div className="col-lg-3 col-sm-6">
					<SearchBox onChange={_handleOnChange} value={searchTerm} />
				</div>
				<div className="col-lg-3 col-sm-6">
					<CustomSelectBox placeholder="Select genre"
						value={selectedGenre}
						options={genreOptions}
						onSelectChange={_handleGenre} />
				</div>
				<div className="col-lg-3 col-sm-6">
					<CustomDatePicker
						mode="range"
						start={dateRange.from ? dateRange.from.toLocaleDateString('en-GB') : 'DD-MM-YYYY'}
						end={dateRange.to ? dateRange.to.toLocaleDateString('en-GB') : 'DD-MM-YYYY'}
						selectDate={handleSelectDate}
						label=""
					/>
				</div>
				<div className="col-lg-3 col-sm-6">
					<NumberInput value={voteCount}
						placeholder="Enter vote count"
						onChange={_handleVoteCount} />
				</div>
			</div>
			<Link to="/favourite"  >Want to see your Favourite list? Click here!!</Link>
			<div className="row d-flex row-gap-16px mt-4">
				{
					movies.map((movie, key) => (
						<div className="col-lg-3 col-md-4 col-sm-6"
							key={key}>
							<MovieCard key={movie.id}
								movie={movie}
								viewMovieInfo={_viewMovieInfo}
								handleFavourite={_handleFavourite} />
						</div>
					))}
			</div>

			{loadingMore && <div>Loading more movies...</div>}
		</Fragment>

	);
};

export default MovieList;
