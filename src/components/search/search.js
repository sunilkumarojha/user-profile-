import { useState } from "react";
import "./search.css";
import React from "react";

const Search = ({ getResponse }) => {
  const [value, setValue] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debounceSearch = (event) => {
    setValue(event.target.value);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    let value = event.target.value;
    let timer;

    timer = setTimeout(() => {
      getResponse(value.toLowerCase());
    }, 500);

    setDebounceTimer(timer);
  };

  return (
    <div className="container mb-4 searchBar">
      <input
        type="search"
        placeholder="Search By Name or Email or Role"
        className="form-control"
        value={value}
        onChange={(event) => debounceSearch(event)}
      />
    </div>
  );
};

export default Search;
