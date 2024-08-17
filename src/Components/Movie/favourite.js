import { Fragment, useEffect, useState } from "react"
import { MovieCard } from "../Card"
import { useNavigate } from "react-router-dom";

const Favourite = () => {

    const navigate = useNavigate();
    const [favourite, setFavourite] = useState([]);

    useEffect(() => {
        // Retrieve the JSON string from sessionStorage and parse it back into an array
        const storedData = sessionStorage.getItem('favouriteMovies');
        if (storedData) {
            setFavourite(JSON.parse(storedData));
        }
    }, []);

    const _handleFavourite = (item) => {
        // Check if the item is already in the retrieved list
        const isInRetrievedList = favourite.some((data) => data.id === item.id);

        // Update the favourite and movies list based on the presence of the item
        let updatedRetrievedData;

        if (isInRetrievedList) {
            // Remove item from favourite
            updatedRetrievedData = favourite.filter((data) => data.id !== item.id);

            // Update movies list to mark the item as not favourite
        } else {
            // Add item to favourite
            updatedRetrievedData = [...favourite, item];

            // Update movies list to mark the item as favourite
        }

        // Update the state
        setFavourite(updatedRetrievedData);

        // Save updatedRetrievedData to sessionStorage
        sessionStorage.setItem('favouriteMovies', JSON.stringify(updatedRetrievedData));
    };

    const _navigateBack = () => {
        navigate("/");
    }

    const _viewMovieInfo = (movie) => {
        navigate("detail", {
            state: {
                data: movie
            }
        })
    };

    return (
        <Fragment>
            <div className="margin-50px-top cursor-pointer d-flex align-items-center "
                onClick={_navigateBack}>
                <i class="fas fa-arrow-left" />
                <span className="margin-10px-left" >Go back</span>
            </div>
            <div className="row d-flex row-gap-16px">
                {
                    favourite.map((movie, key) => (
                        <div className="col-lg-3 col-md-4 col-sm-6"
                            key={key}>
                            <MovieCard key={movie.id}
                                movie={movie}
                                viewMovieInfo={_viewMovieInfo}
                                handleFavourite={_handleFavourite} />
                        </div>
                    ))}
                {
                    favourite.length === 0 &&
                    <h1>No favourite movies added</h1>
                }
            </div>
        </Fragment>
    )
}

export default Favourite