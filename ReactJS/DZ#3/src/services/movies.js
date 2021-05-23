const apiHost = process.env.REACT_APP_SW_API_HOST;

class MoviesApiService {
  getMovies = async (page) => fetch(`${apiHost}/films?page=${page}`);

  getMovie = async (id) => fetch(`${apiHost}/films/${id}`); //

  getStarship = async (id) => fetch(`${apiHost}/starships/${id}`);

  getVehicle = async (id) => fetch(`${apiHost}/vehicles/${id}`);
}
export default new MoviesApiService();
