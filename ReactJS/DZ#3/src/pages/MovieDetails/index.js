import { useEffect, useState } from "react";
import { useParams } from "react-router";

import Loader from "components/Loader";
import ServerError from "components/ServerError";
import moviesApiService from "services/movies";
import { getStarshipsId, getVehiclesId } from "../../utils";

import MovieInfoRow from "../Movies/components/MovieInfoRow";
import StarshipsInfo from "./components/StarshipsInfo";
import VehiclesInfo from "./components/VehiclesInfo";
import styled from "styled-components";

const StarshipsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
`;

const MovieDetails = () => {
  const { id } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [fetchStatus, setFetchStatus] = useState({
    fetching: false,
    error: false,
  });

  const { fetching, error } = fetchStatus;

  useEffect(() => {
    (async () => {
      setFetchStatus({
        fetching: true,
        error: false,
      });
      try {
        const info = await moviesApiService
          .getMovie(id)
          .then((res) => res.json());

        setMovieInfo(info);
        setFetchStatus({
          fetching: false,
          error: false,
        });
      } catch {
        setFetchStatus({
          fetching: false,
          error: true,
        });
      }
    })();
  }, [id]);

  if (fetching) return <Loader />;
  if (error) return <ServerError />;
  if (!movieInfo) return "";

  return (
    <div>
      <h1>{movieInfo.name}</h1>
      <MovieInfoRow name="Name:" value={movieInfo.title} />
      <MovieInfoRow
        name="Year:"
        value={`relased in ${new Date(
          movieInfo.release_date
        ).getFullYear()} year`}
      />
      <MovieInfoRow name="Director:" value={movieInfo.director} />
      <h3>Starships</h3>

      <StarshipsWrapper>
        {movieInfo.starships.map((url) => (
          <StarshipsInfo key={url} id={getStarshipsId(url)} />
        ))}
      </StarshipsWrapper>
      <h3>Vehicles</h3>
      <StarshipsWrapper>
        {movieInfo.vehicles.map((url) => (
          <VehiclesInfo key={url} id={getVehiclesId(url)} />
        ))}
      </StarshipsWrapper>
    </div>
  );
};

export default MovieDetails;
