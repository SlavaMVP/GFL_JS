import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import { loadPlanets } from 'actions/planets';

import Loader from 'components/Loader';
import Pager from 'components/Pager';
import ServerError from 'components/ServerError';
import PlanetTile from './components/PlanetTile';
import { getDefaultImage, getPlanetId, getPlanetImageUrl } from '../../utils';

const defaultImageUrl = getDefaultImage();

const PlanetsWrapper = styled.div`
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

const Planets = () => {
  const dispatch = useDispatch();
  const { planets, fetchingPlanets, planetsError } = useSelector(
    state => state.planets
  );

  const [page, setPage] = useState(1);

  const onImageLoadError = useCallback(e => {
    if (e.target.src !== defaultImageUrl) {
      e.target.src = defaultImageUrl;
      e.target.classList.add('img-placeholder');
    }
  }, []);

  const { next, previous, results: list } = planets || {};

  const handleClickNext = e => {
    e.preventDefault();
    if (next) setPage(page + 1);
  };
  const handleClickPrev = e => {
    e.preventDefault();
    if (previous) setPage(page - 1);
  };

  useEffect(() => {
    dispatch(loadPlanets(page));
  }, [page, dispatch]);

  return (
    <div>
      <h1>Star Wars Planets</h1>

      {fetchingPlanets && <Loader />}

      {planetsError && <ServerError />}
      {!planetsError && !fetchingPlanets && list && (
        <>
          <PlanetsWrapper>
            {list.map(item => {
              const cloneItem = { ...item };
              cloneItem.id = getPlanetId(item.url);
              cloneItem.imgSrc = getPlanetImageUrl(cloneItem.id);

              return (
                <PlanetTile
                  key={cloneItem.name}
                  item={cloneItem}
                  onImageLoadError={onImageLoadError}
                />
              );
            })}
          </PlanetsWrapper>

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

export default Planets;
