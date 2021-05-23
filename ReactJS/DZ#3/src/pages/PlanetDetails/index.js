import { useEffect, useState } from "react";
import { useParams } from "react-router";

import Loader from "components/Loader";
import ServerError from "components/ServerError";
import planetsApiService from "services/planets";
import { getPeopleId } from "../../utils";

import PlanetInfoRow from "../Planets/components/PlanetInfoRow";
import CharactersInfo from "./components/CharactersInfo";
import styled from "styled-components";

const CharacterWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlanetDetails = () => {
  const { id } = useParams();
  const [planetInfo, setPlanetInfo] = useState(null);
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
        const info = await planetsApiService
          .getPlanet(id)
          .then((res) => res.json());

        setPlanetInfo(info);
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
  if (!planetInfo) return "";

  return (
    <div>
      <h1>{planetInfo.name}</h1>
      <PlanetInfoRow name="Diameter:" value={`${planetInfo.diameter} km`} />
      <PlanetInfoRow name="Population:" value={`${planetInfo.population} km`} />
      <PlanetInfoRow name="Terrain:" value={`${planetInfo.terrain} km`} />
      <h3>Residents</h3>
      <CharacterWrapper>
        {planetInfo.residents.map((url) => (
          <CharactersInfo key={url} id={getPeopleId(url)} />
        ))}
        <CharactersInfo />
      </CharacterWrapper>
    </div>
  );
};

export default PlanetDetails;
