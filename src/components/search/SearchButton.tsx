import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFetch } from "react-async";

const fetchCount = async ({ fetchPath }: { fetchPath: string }) => {
  const response = await fetch(fetchPath);
  if (!response.ok) { console.warn(`search count query failed: ${response}`)}
  return await response.json();
};

const SearchButton = ({ linkTo, fetchPath, toggleSearch }: { linkTo: string; fetchPath: string | null; toggleSearch: () => void }) => {
  const location = useLocation();
  if (fetchPath) {
    const { data, error }:  { data: { rows: { numphotos: number}[]}; error: any }= useFetch(fetchPath, {
      headers: { accept: "application/json" },
    });

    if (error) {
      return null;
    }

    if (data) {
      if (data.rows[0].numphotos === 0) {
        return (
          <button
            role='submit'
            disabled
          >
            No Results: Change some values above
          </button>
        );
      }
      // if the url hasn't changed don't link, just turn off the search
      if (location.pathname === linkTo) {
        return (
          <button
            role='submit'
            onClick={toggleSearch}
          >
            {`See Results: ${data.rows[0].numphotos.toLocaleString()} Photos`}
          </button>
        );
      }
      return (
        <Link
          to={linkTo}
          role='submit'
        >
          <button
            role='submit'
          >
            {`See Results: ${data.rows[0].numphotos.toLocaleString()} Photos`}
          </button>
        </Link>
      );
    }
  }

  return (
      <button
        role='submit'
        disabled
      >
        Use the Search Fields Above
      </button>
  );
};

export default SearchButton;
