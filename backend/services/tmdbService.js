require("dotenv").config();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function cleanMovieTitle(movieTitle) {
  return movieTitle
    .replace(/\(.*?\)/g, "")
    .replace("Sing-A-Long", "")
    .replace("Outdoor Cinema", "")
    .trim();
}

async function searchMovie(movieTitle) {
  const cleanTitle = cleanMovieTitle(movieTitle);

  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(cleanTitle)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    },
  );

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  return data.results[0];
}

async function getMovieImage(movieTitle) {
  const movie = await searchMovie(movieTitle);

  if (!movie || !movie.poster_path) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
}

async function getMovieDetails(movieTitle) {
  const movie = await searchMovie(movieTitle);

  if (!movie) {
    return null;
  }

  return {
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    releaseDate: movie.release_date,
    posterUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : null,
    backdropUrl: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : null,
  };
}

module.exports = {
  searchMovie,
  getMovieImage,
  getMovieDetails,
};
