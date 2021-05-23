import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";

import { loadMovies } from "actions/movies";

import Loader from "components/Loader";
import Pager from "components/Pager";
import ServerError from "components/ServerError";
import MovieTile from "./components/MovieTile";
import { getDefaultImage, getMovieId, getMovieImageUrl } from "../../utils";

const defaultImageUrl = getDefaultImage();

const MoviesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 30px;
  align-items: stretch;
  align-content: flex-start;
  justify-content: flex-start;
  > div {
    flex-grow: 1;
    width: 300px;
    &:last-of-type {
      flex-grow: 0;
    }
  }
`;

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, fetchingMovies, moviesError } = useSelector(
    (state) => state.movies
  );

  const [page, setPage] = useState(1);

  const onImageLoadError = useCallback((e) => {
    if (e.target.src !== defaultImageUrl) {
      e.target.src = defaultImageUrl;
      e.target.classList.add("img-placeholder");
    }
  }, []);

  const { next, previous, results: list } = movies || {};

  const handleClickNext = (e) => {
    e.preventDefault();
    if (next) setPage(page + 1);
  };
  const handleClickPrev = (e) => {
    e.preventDefault();
    if (previous) setPage(page - 1);
  };

  useEffect(() => {
    dispatch(loadMovies(page));
  }, [page, dispatch]);

  return (
    <div>
      <h1>Star Wars Movies</h1>

      {fetchingMovies && <Loader />}

      {moviesError && <ServerError />}
      {!moviesError && !fetchingMovies && list && (
        <>
          <MoviesWrapper>
            {list.map((item) => {
              const cloneItem = { ...item };
              cloneItem.id = getMovieId(item.url);
              cloneItem.imgSrc = getMovieImageUrl(cloneItem.id);

              return (
                <MovieTile
                  key={cloneItem.title}
                  item={cloneItem}
                  onImageLoadError={onImageLoadError}
                />
              );
            })}
          </MoviesWrapper>

          <Pager
            previous={previous}
            next={next}
            handleClickPrev={handleClickPrev}
            handleClickNext={handleClickNext}
          />
        </>
      )}
    </div>
  );
};

export default Movies;
