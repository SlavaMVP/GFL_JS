import React from 'react';
import { Link } from 'react-router-dom';
import useCharacter from '../../../hooks/useCharacter';

export default function CharactersInfo({ id }) {
  const info = useCharacter(id);
  return info ? (
    <Link to={`/characters/${id}`}>{info.name}</Link>
  ) : (
    <p>Loading...</p>
  );
}
