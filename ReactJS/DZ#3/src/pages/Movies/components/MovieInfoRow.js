const MovieInfoRow = ({ name, value, type }) => {
  return (
    <>
      <dt>{name}</dt>
      <dd>{value}</dd>
    </>
  );
};

export default MovieInfoRow;
