const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadBtn = lightBox.querySelector(".uil-import");

const API_KEY = "46109214-be42db0ce29751e4d2e39fed7";
const perPage = 15;
let currentPage = 1;
const apiURL = `https://pixabay.com/api/?key=${API_KEY}&page=${currentPage}&per_page=${perPage}`;
let query = null;

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image."));
}

const showLightBox = (user, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = user;
    downloadBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick = "showLightBox('${img.user}', '${img.largeImageURL}')">
            <img src="${img.largeImageURL}" alt="image">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.user}</span>
                </div>
                <button onclick = "downloadImg('${img.largeImageURL}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

const fetchImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL).then(res => res.json()).then(data => {
        generateHTML(data.hits);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("API fetching error"));
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://pixabay.com/api/?key=${API_KEY}&page=${currentPage}&per_page=${perPage}`;
    apiURL = query ? `https://pixabay.com/api/?key=${API_KEY}&q=${query}&page=${currentPage}&per_page=${perPage}` : apiURL;
    fetchImages(apiURL);
}

const loadSearchImages = (e) => {
    if(e.target.value === "") return query = null;
    if(e.key === "Enter") {
        currentPage = 1;
        query = e.target.value;
        imagesWrapper.innerHTML = "";
        fetchImages(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&page=${currentPage}&per_page=${perPage}`);
    }
}

fetchImages(apiURL);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
