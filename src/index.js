//importing base movie functions
const {getMovies, postMovie, deleteMovie, getMovie, editMovie} = require('./api.js');

//assigning movie properties to constants for use throughout the index
const formTitle = $('#mName')
const formRating = $('#rating')
const formId = $('#theMovieId')
const formGenre = $('#genre')

//OMDB-API key for finding posters corresponding to the given movie title
const movieImg = require("./keys.js").default;

//OMDB-API call
function fetchPoster(movieTitle) {
    return fetch(`http://www.omdbapi.com/?apikey=${movieImg}&s=${encodeURIComponent(movieTitle)}`).then((response) => response.json())
}
//building and populating card with html containing all movie properties
function buildCard(title, rating, id, genre, img) {
    var html = $('#movieStuff').html()
    $('#movieStuff').html(html + `
            <div class="col-3"> 
                <div class="card my-3 ">
                         <img class="card-img-top " src="${img}" alt="Card image cap">
                         <div class="card-body">
                             <h5 class="card-title">${title}</h5>
                             <ul class="list-group list-group-flush">
                                 <li class="list-group-item">rating: ${rating}</li>
                                 <li class="list-group-item">genre: ${genre}</li>
                            </ul>
                            <footer class="w-100 text-center">
                                <div class="btn-group w-100">
                                <button class="deleteBtn btn btn-danger w-50" data-id="${id}">Delete</button>
                                <button class="editButton btn btn-primary w-50"  data-id="${id}">Edit</button> 
                                </div>                           
                            </footer>
                         </div>    
                 </div>
            </div>`);
}

//clears forms on editing and submitting
function clearForms() {
    formGenre.val("");
    formTitle.val("");
    formRating.val("");
    formId.val("");
}



let currentMovies = [];
const refresh = () => {
    getMovies().then((movies) => {
        currentMovies = movies;
        console.log(currentMovies);
        $("#loadingCircle").hide();
        console.log('Here are all the movies:');
        $('#movieStuff').html("");
        movies.forEach(({title, rating, id, genre, img}, idx) => {
            var html = $('#movieStuff').html();
            console.log(`id#${id} - ${title} - rating: ${rating}`);
            if (typeof img === "undefined" || img === "") {
                fetchPoster(title).then((data) => {
                    // console.log(data)
                    var imgUrl = data.Search[0].Poster;
                    img = imgUrl;
                    editMovie({id: id, img: imgUrl});
                    buildCard(title, rating, id, genre, img);
                    // if (idx % 5 === 0) {
                    //     $('#movieStuff').html(html + `<div class="w-100"></div>`);
                    // }
                })
            } else {
                buildCard(title, rating, id, genre, img);
                // if (idx % 5 === 0) {
                //     $('#movieStuff').html(html + `<div class="w-100"></div>`);
                // }
            }

        });

        addingEditButtonEventListener();
        $('.deleteBtn').each(function () {
            $(this).click(function () {
                $(this).attr('disabled', true)
                deleteMovie($(this).attr("data-id")).then(() => {
                    $(this).attr('disabled', false)
                    refresh()
                }).catch((error) => {
                    console.log(error);
                })
            })
        })

        function addingEditButtonEventListener() {
            $('.editButton').each(function () {
                $(this).click(function () {
                    $('#exampleModalLong').modal('toggle');
                    console.log("Hello from inside the code");
                    $('.modal').toggleClass("is-active");
                    $(this).attr('disabled', true)
                    getMovie($(this).attr("data-id")).then(function ({title, id, rating, genre}) {
                        $(this).attr('disabled', false)
                        formGenre.val(genre);
                        formTitle.val(title);
                        formRating.val(rating);
                        formId.val(id);
                    })
                })
            })
        }
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.')
        console.log(error);
    });
}
refresh();
$('#submitButton').click(function (e) {
    $('#exampleModalLong').modal('toggle')
    e.preventDefault();
    var newMovieName = $('#mName').val();
    var newMovieRating = $('#rating').val();
    if (formId.val() === "") {
        postMovie({title: newMovieName, rating: parseInt(newMovieRating), genre: formGenre.val()}).then(() => {
            window.scrollTo(0,document.body.scrollHeight);
            $(this).attr('disabled', false)
            clearForms()
            refresh()
        }).catch((error) => {
            console.log(error);
        })
    } else {
        editMovie({
            title: newMovieName,
            rating: parseInt(newMovieRating),
            id: formId.val(),
            genre: formGenre.val()
        }).then(() => {
            $(this).attr('disabled', false)
            clearForms()
            refresh()
        }).catch((error) => {
            console.log(error);
        })
    }
})



