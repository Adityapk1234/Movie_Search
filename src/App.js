import React, { useEffect, useState } from "react";
import Movies from "./components/Movies";
import SearchBox from "./components/SearchBox";
import Pagination from "./components/Pagination";
import MovieDetails from "./components/MovieDetails";

const api =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b0fe2be9feecde8c7e0916360eb018ba&page=1";
const search_api =
  "https://api.themoviedb.org/3/search/movie?&api_key=b0fe2be9feecde8c7e0916360eb018ba&query=";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMovie, setCurrentMovie] = useState(null);

  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setMovies(data.results);
      });
  }, []);

  const nextPage = (pageNumber) => {
    fetch(`${search_api}${searchTerm}&page=${pageNumber}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMovies(data.results);
        setCurrentPage(pageNumber);
      });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(searchTerm);

    if (searchTerm) {
      fetch(search_api + searchTerm)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setMovies(data.results);
          setTotalResults(data.total_results);
        });
    }
  };

  const viewMovieInfo = (id) => {
    let filteredMovie;
    movies.forEach((movie, i) => {
      if (movie.id === id) {
        filteredMovie = movie;
      }
    });

    setCurrentMovie(filteredMovie);
  };

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const closeMovieInfo = () => {
    setCurrentMovie(null);
  };

  const numberPages = Math.floor(totalResults / 20);

  return (
    <div>
      <header>
        <form onSubmit={handleOnSubmit}>
          <SearchBox onChange={handleOnChange} value={searchTerm} />
        </form>
      </header>

      {currentMovie === null ? (
        <div className="App">
          <Movies viewMovieInfo={viewMovieInfo} movies={movies} />
        </div>
      ) : (
        <MovieDetails
          currentMovie={currentMovie}
          closeMovieInfo={closeMovieInfo}
        />
      )}
      {totalResults > 20 && currentMovie === null ? (
        <Pagination
          pages={numberPages}
          nextPage={nextPage}
          currentPage={currentPage}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
