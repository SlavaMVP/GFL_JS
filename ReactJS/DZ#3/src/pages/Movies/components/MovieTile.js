import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import MovieInfoRow from "./MovieInfoRow";

const MovieInfoWrapper = styled.div`
  dt {
    width: 94px;
  }
  dd {
    margin-left: 111px;
  }
`;

export default function MovieTile({ item, onImageLoadError }) {
  return (
    <div className="thumbnail planet-image">
      <img src={item.imgSrc} alt={item.title} onError={onImageLoadError} />
      <div className="caption">
        <h3>
          <Link to={`/film/${item.id}`}>{item.title}</Link>
        </h3>
        <MovieInfoWrapper>
          <dl className="dl-horizontal">
            <MovieInfoRow name="Title:" value={item.title} />
            <MovieInfoRow name="Director:" value={item.director} />
            <MovieInfoRow name="Producer(-s):" value={`${item.producer}`} />
            <MovieInfoRow
              name="Release Year:"
              value={new Date(item.release_date).getFullYear()}
            />
          </dl>
        </MovieInfoWrapper>
      </div>
    </div>
  );
}
