// when the page loads we want to do 2 things

// 1. get file from figma
// 2. organize the file by IDs
// with the IDs we will generate some images
// then add then to the website
const loadingTag = document.querySelector("header p.loading")
const nextTag = document.querySelector("a.next")
const prevTag = document.querySelector("a.previous")
const stepsTag = document.querySelector('footer span')
const sliderTag = document.querySelector("div.slider")
const footerTag = document.querySelector("footer")

let currentSlide = 0

let totalSlides = 0


const apiKey = "figd_ZrfXJpor0Eq8-xiciCu_K86WZjAKLSjtjv3O_N1c"
const apiHeaders = {
    headers: {
        "X-Figma-Token": apiKey
    }
    
}

const loadFile = function (key) {
    return fetch("https://api.figma.com/v1/files/" + key, apiHeaders)
        .then(resolve => resolve.json())
        .then(data => {
            //return a list of frame ids here 
            const ids =  data.document.children[0].children.map(function (frame) {
                return frame.id
            })

            const title = data.name

            return {
                key: key, 
                ids: ids,
                title: title
            }
        })
}

const loadImages = function (obj) {
    const key = obj.key
    const ids = obj.ids.join(",")
    console.log(ids)
    return fetch("https://api.figma.com/v1/images/" + key + "?ids=" + ids + "&scale=1&format=svg", apiHeaders)
        .then(response => response.json())
        .then(data => {
            return obj.ids.map(id => {
                return data.images[id]
            })
        })
}

const addImagesToSite = function (urls) {
    const sliderTag = document.querySelector("div.slider")

    totalSlides = urls.length

    footerTag.classList.add("show")

    sliderTag.innerHTML = ""

    urls.forEach(url => {
        sliderTag.innerHTML = sliderTag.innerHTML + `
        <div>
            <img src="${url}">
        </div>
        `
    })
}

loadFile("rqOhRFLeD0eJCf8zaoxhFN")
    .then(file => {
        loadingTag.innerHTML = file.title
        document.title = file.title + " | Figure"

        return file
    })
    .then(file => loadImages(file))
    .then(imageUrls => addImagesToSite(imageUrls))

// lets set up the slider and make it work

const next = () => {
    currentSlide = currentSlide + 1
    if(currentSlide >= totalSlides) {
        currentSlide = totalSlides - 1
    }
    moveSlider()
}

const previous = () => {
    currentSlide = currentSlide - 1
    if(currentSlide < 0) {
        currentSlide = 0
    }
    moveSlider()
}

const moveSlider = () => {
    sliderTag.style.transform = `translate(${currentSlide * -100}vw, 0)`
    stepsTag.innerHTML = `${currentSlide + 1} / ${totalSlides}`
}

nextTag.addEventListener("click", function (event) {
    
    next()
    event.preventDefault()
})

prevTag.addEventListener("click", (event) => {
    
    previous()
    event.preventDefault()
})