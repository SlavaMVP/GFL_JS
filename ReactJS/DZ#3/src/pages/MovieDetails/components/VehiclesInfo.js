import React, { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useStarships from "../../../hooks/useVehicles";
import styled from "styled-components/macro";

import { getVehickleImageUrl, getDefaultImage } from "../../../utils";

const defaultImageUrl = getDefaultImage();

export default function VehiclesInfo({ id }) {
  const imgRef = useRef();
  const info = useStarships(id);
  const imgUrl = getVehickleImageUrl(id);

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

  return info ? (
    <TransportWrapper>
      <img
        ref={imgRef}
        src={imgUrl}
        alt={info?.name}
        onError={onImageLoadError}
      />
      <h4>
        <Link to={`/vehicles/${id}`}>{info.name}</Link>
      </h4>

      <AddirionalInfo>
        <li>Model: {info.model}</li>
        <li>Class: {info.vehicle_class}</li>
        <li>Max speed: {info.max_atmosphering_speed}</li>
        <li>Price: {info.cost_in_credits}</li>
      </AddirionalInfo>
    </TransportWrapper>
  ) : (
    <p>Loading...</p>
  );
}
