
module.exports = {
  getMovies: () => {
    return fetch('/api/movies')
      .then(response => response.json());
  },
  postMovie: (data) => {

    return fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  deleteMovie: (id) => {
    return fetch ('/api/movies/' + id,{
      method: 'DELETE'
    })
  },
  editMovie: (data) => {
    return fetch ('/api/movies/' + data.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  getMovie: (id) => {
    return fetch('/api/movies/' + id)
        .then(response => response.json());
  }
};
