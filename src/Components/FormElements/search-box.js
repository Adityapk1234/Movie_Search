import React from "react";

const SearchBox = (props) => {
  return (
    <input
      className="search w-100 h-100"
      type="search"
      placeholder="Search Movie..."
      onChange={props.onChange}
    />
  );
};
export default SearchBox;
