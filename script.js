const bottomBtn = document.querySelector('#bottom')
const topBtn = document.querySelector('#top')

bottomBtn.addEventListener('click', scrollToBottom)
topBtn.addEventListener('click', scrollToTop)




function scrollToBottom(){
          window.scrollTo(0 , document.body.scrollHeight )

}
function scrollToTop(){ 
    window.scrollTo(0 ,0 )
}

// '58129d8780baa414abaffbc3f3d479b4'
// 'https://image.tmdb.org/t/p/w500'
// https://api.themoviedb.org/3/movie/157336?api_key=58129d8780baa414abaffbc3f3d479b4
const togglebtn = document.querySelector('.togglebtn')

const onOff = document.getElementById('onOff')

// togglebtn.addEventListener('click', () => {
//     document.body.classList.toggle('darktheme')
//     if (document.body.classList.contains('darktheme')) {
//         onOff.classList.add("fa-sun")
//         onOff.classList.remove("fa-moon")
//     }
//     else {
//         onOff.classList.add("fa-moon")
//         onOff.classList.remove("fa-sun")
//     }
// })
const backBtn = document.querySelector('.back')

const favorite = document.querySelector('.favorite')


let emptyArr = []

const arr = [];
const newArr = [];
const content_val = document.querySelector('.content_box')
const btn = document.querySelector('.search button');
const input = document.querySelector('.search  input');
const moviescontainer = document.querySelector('.movies_container h1');

const moviegrid = document.querySelector('.movie_grid');
// const movieGridContainer = document.querySelector('.movie_grid_container');
const main_content = document.querySelector('.main_content');
const popup_container = document.querySelector('.popup_container');

const Api_Key = 'api_key=58129d8780baa414abaffbc3f3d479b4';
const imagepath = 'https://image.tmdb.org/t/p/w1280';
let filteredArr = [];
let btnValue = 0;


backBtn.addEventListener('click', backTo)
function backTo() {
    moviescontainer.style.display="none"
    content_val.style.display = "flex";
    moviegrid.style.display = "none";
    window.scrollTo(0,0)
}

function handleclick() {
    content_val.style.display = "none";
    show_searched_movies_to_dom()
    filteredArr.splice(0)
}




async function entire_content() {
    // display = true;
    let url = `https://api.themoviedb.org/3/discover/movie?${Api_Key}`
    await fetch(url).then(res => res.json()).then(data => {
        newArr.push(...data.results)
        main_content.innerHTML = newArr.map((data) => {
            return `
    <div class="card" id="${data.id}">
<div class="img_container">
<img src="${imagepath + data.poster_path}" alt="">
</div>
<div class="info">
<h2>${data.title}</h2>
<div class="info_1">
    <span>Rating: </span>
    <span>${data.vote_average}/10 </span>  
</div>
<div class="info_1">
    <span>Release: </span>
    <span>${data.release_date} </span>
</div>
</div>

</div>`
        }).join('')

        const cards = document.querySelectorAll('.card')
        show_movie_by_id(cards)

    })
}
entire_content()




btn.addEventListener('click', handleclick)

async function fetchMovies_by_search(search_term) {
    const url = `https://api.themoviedb.org/3/search/movie?${Api_Key}&query=${search_term}`
    await fetch(url).then(res => res.json())
        .then(data => {
            // console.log(data.results)
            arr.push(...data.results)
        })
    return arr
}

// btn.addEventListener('click', show_searched_movies_to_dom);

async function show_searched_movies_to_dom() {


    filteredArr = await fetchMovies_by_search(input.value)
    //  console.log(filteredArr, "working")


    moviescontainer.innerText = `Search Results...${input.value}`;
    moviegrid.innerHTML = filteredArr.map(e => {
        return `<div class="card" id="${e.id}">
                <div class="img_container">
                    <img src="${imagepath + e.poster_path}"alt="">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                        <div class="info_1">
                        <span>Rate:</span>
                        <span>${e.vote_average}/10</span>
                </div>
                <div class="info_1">
                    <span>release:</span>
                    <span>${e.release_date}</span>
                </div>
            </div>
</div>`
    }).join('')

    if (input.value == "") {
        alert('Type any movie')
    }
    input.value = '';

    // when we click on the card we want it to display the entire details of that particular card so we create a function with show_movies_by_id()

    const cards = document.querySelectorAll('.card')
    show_movie_by_id(cards)
};

function show_movie_by_id(cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => show_popup(card))
    });
}



async function fetchMovies_by_id(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?${Api_Key}`
    const res = await fetch(url)
    const data = await res.json()
    // console.log(data)
    return data

}
async function fetchMovies_by_trailer(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?${Api_Key}`
    const res = await fetch(url)
    const data = await res.json()
    console.log(data.results[0].key)
    return data.results

}
// fetchMovies_by_trailer(1067282) 

async function show_popup(card) {
   
    bottomBtn.style.display = "none"
    topBtn.style.display = "none";
    backBtn.style.display = "none"

    popup_container.classList.add('show_popup')
   
 

    const movie_id = card.getAttribute('id');
    const movie = await fetchMovies_by_id(movie_id)
    const movie_trailer = await fetchMovies_by_trailer(movie_id);
    console.log(movie_trailer)
    const trailer = movie_trailer[0].key;
    popup_container.style.background = `linear-gradient(var(--background_color), rgba(0, 0, 0, 0.384)), url(${imagepath + movie.poster_path})no-repeat center/cover`;

    popup_container.innerHTML = `<div class="content">
<div class="left_content">
    <span class="xbar">&#10006</span>
    <div class="img_poster">
        <img src="${imagepath + movie.poster_path}">
    </div>
    

</div>
<div class="right_content">
    <h1>${movie.title}</h1>
    <h3>${movie.tagline}</h3>
    <div class="info_container">
    <div class="info">
    <div class="info_1">
        <span>Language:</span>
        <span>'${movie.spoken_languages[0].name}'</span>
    </div>
    <div class="info_1">
        <span>Length:</span>
        <span>${movie.runtime}mins</span>
    </div>
    <div class="info_1">
        <span>Ratings:</span>
        <span>${movie.vote_average}/10</span>
    </div>
    <div class="info_1">
        <span>Budget:</span>
        <span>${movie.budget}$</span>
    </div>
   
    <div class="info_1">
        <span>Release date:</span>
        <span>${movie.release_date}</span>
    </div>
</div>
        <div class="genres">
            <h2>Genre</h2>
            <ul>
            ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
            </ul>
        </div>
        <div class="overview">
        <h2>Overview</h2>
        <p>${movie.overview}</p>
    </div>
        <div class="trailer">
            <h2>Trailer</h2>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer}"
                title="YouTube video player" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>

</div>
</div>`

    // const heartBtn = document.querySelector('.heart')

    // heartBtn.addEventListener('click',  () => {
      
    //     if (heartBtn.classList.contains('changed')) {
    //         heartBtn.classList.remove('changed')    
    //     }
    //     else{
        
    //         heartBtn.classList.add('changed')
    //     }
    // })









    const xbar = document.querySelector('.xbar')
    xbar.addEventListener('click', () => {
        
        bottomBtn.style.display = "block"
        topBtn.style.display = "block"
        backBtn.style.display = "block"
    
        popup_container.classList.remove('show_popup')
    })
}

//heart button yet to b optimized---> to add favorite movies section------------------->



// function getData(){
//    const movie_ids =JSON.parse(localStorage.getItem('movie-con'))
//   return movie_ids === null ? [] : movie_ids
// }

// function saveData(id){
//     const movie_ids = getData();
//     localStorage.setItem('movie-con',JSON.stringify([...movie_ids,id]))
// }

// // saveData(999999)
