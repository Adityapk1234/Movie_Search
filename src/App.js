import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Favourite, MovieDetails, MovieList } from "./Components/Movie";

function App() {


  return (
    <Router>

      <div className="container">
        <Routes>
          <Route path="/" >
            <Route index element={<MovieList />} />
            <Route path="detail" element={<MovieDetails />} />
            <Route path="favourite" element={<Favourite />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
