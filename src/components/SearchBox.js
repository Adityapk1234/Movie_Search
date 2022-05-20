import React from "react";

const SearchBox = (props) => {
  return (
    <div>
      <input
        className="search"
        type="search"
        placeholder="Search Movie..."
        onChange={props.onChange}
      />
    </div>
  );
};
export default SearchBox;
