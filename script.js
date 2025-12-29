
const input = document.getElementById("search-box");
const searchBtn = document.getElementById("search-btn");
const movieContainer = document.getElementById("movie-container");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");


const genres = ["harry", "avatar", "spider", "oppenheimer", "barbie", "john wick"];
const apiKey = "864d164c";


function fetchInitialMovies() {
  const results = [];
  let totalFetched = 0;

  function fetchMore(index = 0) {
    if (index >= genres.length || totalFetched >= 25) {
      displayMovies(results.slice(0, 25));
      return;
    }

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${genres[index]}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.Response === "True") {
          data.Search.forEach(movie => {
            if (totalFetched < 25) {
              results.push(movie);
              totalFetched++;
            }
          });
        }
        fetchMore(index + 1);
      })
      .catch(() => fetchMore(index + 1));
  }

  fetchMore();
}


function displayMovies(movies) {
  movieContainer.innerHTML = "";

  movies.forEach(movie => {
    const poster = movie.Poster !== "N/A" ? movie.Poster : "img/notfound.png";

    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>Type: ${movie.Type}</p>
      <p>Year: ${movie.Year}</p>
    `;

    movieContainer.appendChild(card);
  });
}


function fetchMovies(query) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        displayMovies(data.Search);
      } else {
        movieContainer.innerHTML = `<div class="no-movies">
                                      <p >Aucun film trouvé!</p> </div>`;
      }
    })
    .catch(() => {
      movieContainer.innerHTML = `<div class="no-movies">
                                   <p>Erreur lors de la recherche.</p></div>`;
    });
}


window.addEventListener("load", fetchInitialMovies);

searchBtn.addEventListener("click", () => {
  const movieName = input.value.trim();
  if (movieName) fetchMovies(movieName);
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const movieName = input.value.trim();
    if (movieName) fetchMovies(movieName);
  }
});


hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.toggle("show");
});

window.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && e.target !== hamburger) {
    navLinks.classList.remove("show");
  }
});


document.querySelectorAll(".comment").forEach(comment => {
  comment.addEventListener("click", () => {
    comment.classList.toggle("open");
  });
});
