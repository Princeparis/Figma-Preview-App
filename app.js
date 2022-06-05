// when the page loads we want to do 2 things

// 1. get file from figma
// 2. organize the file by IDs
// with the IDs we will generate some images
// then add then to the website
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

            return {
                key: key, 
                ids: ids
            }
        })
}

const loadImages = function (obj) {
    const key = obj.key
    const ids = obj.ids.join(",")
    console.log(ids)
    return fetch("https://api.figma.com/v1/images/" + key + "?ids=" + ids, apiHeaders)
        .then(response => response.json())
        .then(data => {
            return obj.ids.map(id => {
                return data.images[id]
            })
        })
}

const addImagesToSite = function (urls) {
    const sectionTag = document.querySelector("section")

    sectionTag.innerHTML = ""

    urls.forEach(url => {
        sectionTag.innerHTML = sectionTag.innerHTML + `
        <div>
            <img src="${url}">
        </div>
        `
    })
}

loadFile("rqOhRFLeD0eJCf8zaoxhFN")
    .then(ids => loadImages(ids))
    .then(imageUrls => addImagesToSite(imageUrls))
