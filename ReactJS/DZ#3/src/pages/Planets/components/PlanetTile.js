import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import PlanetInfoRow from './PlanetInfoRow';

const PlanetInfoWrapper = styled.div`
  dt {
    width: 94px;
  }
  dd {
    margin-left: 111px;
  }
`;

export default function PlanetTile({ item, onImageLoadError }) {
  return (
    <div className='thumbnail planet-image'>
      <img src={item.imgSrc} alt={item.name} onError={onImageLoadError} />
      <div className='caption'>
        <h3>
          <Link to={`/planet/${item.id}`}>{item.name}</Link>
        </h3>
        <PlanetInfoWrapper>
          <dl className='dl-horizontal'>
            <PlanetInfoRow name='Climate' value={item.climate} />
            <PlanetInfoRow name='Diameter' value={`${item.diameter} km`} />
            <PlanetInfoRow name='Population' value={item.population} />
            <PlanetInfoRow name='Terrain' value={item.terrain} />
            <PlanetInfoRow
              name='Orbital period'
              value={`${item.orbital_period} d`}
            />
          </dl>
        </PlanetInfoWrapper>
      </div>
    </div>
  );
}
