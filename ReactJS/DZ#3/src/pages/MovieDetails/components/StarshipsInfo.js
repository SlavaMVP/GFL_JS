import React, { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useStarships from "../../../hooks/useStarships";
import styled from "styled-components/macro";

import { getStarshipImageUrl, getDefaultImage } from "../../../utils";

const defaultImageUrl = getDefaultImage();

export default function StarshipsInfo({ id }) {
  const imgRef = useRef();
  const info = useStarships(id);
  const imgUrl = getStarshipImageUrl(id);

  const TransportWrapper = styled.div`
    display: flex;
    flex-direction: column;
    > img {
      width: 100%;
    }
  `;

  const AddirionalInfo = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    > li {
      backgraund-color: lightgray;
    }
  `;

  const onImageLoadError = useCallback((e) => {
    if (imgRef.current.src !== defaultImageUrl) {
      imgRef.current.src = defaultImageUrl;
      imgRef.current.classList.add("img-placeholder");
    } else {
      imgRef.current.src = imgUrl;
    }
  }, []);

  console.log(info);

  return info ? (
    <TransportWrapper>
      <img
        ref={imgRef}
        src={imgUrl}
        alt={info?.name}
        onError={onImageLoadError}
      />
      <h3>
        <Link to={`/starships/${id}`}>{info.name}</Link>
      </h3>

      <AddirionalInfo>
        <li>Model: {info.model}</li>
        <li>Class: {info.starship_class}</li>
        <li>Max speed: {info.max_atmosphering_speed}</li>
        <li>Price: {info.cost_in_credits}</li>
      </AddirionalInfo>
    </TransportWrapper>
  ) : (
    <p>Loading...</p>
  );
}
