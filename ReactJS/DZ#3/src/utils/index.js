export const getDefaultImage = () => `${process.env.REACT_APP_DEFAULT_IMG_URL}`;

export const getPlanetId = (url) => /planets\/(\d+)/i.exec(url)?.[1];
export const getPeopleId = (url) => /people\/(\d+)/i.exec(url)?.[1];

export const getMovieId = (url) => /films\/(\d+)/i.exec(url)?.[1]; //new

export const getStarshipsId = (url) => /starships\/(\d+)/i.exec(url)?.[1]; //new
export const getVehiclesId = (url) => /vehicles\/(\d+)/i.exec(url)?.[1]; //new

export const getPlanetImageUrl = (id) =>
  `${process.env.REACT_APP_SW_VISUAL_API_HOST}/assets/img/planets/${id}.jpg`;

export const getMovieImageUrl = (id) =>
  `${process.env.REACT_APP_SW_VISUAL_API_HOST}/assets/img/films/${id}.jpg`; //new

export const getStarshipImageUrl = (id) =>
  `${process.env.REACT_APP_SW_VISUAL_API_HOST}/assets/img/starships/${id}.jpg`; //new

export const getVehickleImageUrl = (id) =>
  `${process.env.REACT_APP_SW_VISUAL_API_HOST}/assets/img/vehicles/${id}.jpg`; //new
