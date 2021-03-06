// Config
const host = "https://content.guardianapis.com"
const key = "9wur7sdh84azzazdt3ye54k4"
const userErrorMessage = "Sorry, this content isn't available right now. Try reloading this page."

// Wait until HTML has fully loaded before doing anything
document.addEventListener("DOMContentLoaded", ()=>{
  // First, make the tabs clickable because that doesn't need any data from the server
  makeTabsNavigable()
  // Request data for the initially visible tab first, followed by the invisible ones
  populateContent("/search?section=uk-news&show-fields=trailText,thumbnail&page-size=5", document.querySelector(".tabs__panel#panel1"))
  populateContent("/search?section=football&show-fields=trailText,thumbnail&page-size=5", document.querySelector(".tabs__panel#panel2"))  
  populateContent("/search?section=travel&show-fields=trailText,thumbnail&page-size=5", document.querySelector(".tabs__panel#panel3"))
})

function makeTabsNavigable(){
  // Get all the DOM elements
  let tabs = document.querySelectorAll(".tabs__tab")
  let panels = document.querySelectorAll(".tabs__panel")
  // Add an event listener to each tab
  for(let i = 0; i<tabs.length; i++){
    tabs[i].addEventListener("click", ()=>{
      // And if it's clicked, remove the active class from everything...
     for(var j=0; j<tabs.length; j++){
       panels[j].classList.remove("tabs__panel--active")
       tabs[j].classList.remove("tabs__tab--active")
     }
      // ...And only re-add it to the right tab and panel
      panels[i].classList.add("tabs__panel--active")
      tabs[i].classList.add("tabs__tab--active")   
    })
  }
}

// Generic function to return a request-ready API endpoint
function buildEndpoint(path){
  return `${host}${path}&api-key=${key}`
}

// Generic function to fill a given DOM element with data from a given API path
function populateContent(path, panel){
  const request = new XMLHttpRequest();
  request.open('GET', buildEndpoint(path));
  request.onload = function() {
    createList(JSON.parse(request.response).response.results, panel);
  };
  request.onerror = function() {
    apologiseToUser(panel)
  };
  request.send();
}

// Take an array of data and add a list to the DOM based on that data
function createList(stories, panel){
  
  console.log(stories)
  let ol = document.createElement('ol')
  ol.classList.add('stories')
  // And create an li element for each story in the array
  for(let i = 0; i<stories.length; i++){
    let li = document.createElement('li')
    li.classList.add('stories__story')
    li.innerHTML = `<a class="stories__story-link" href="${stories[i].webUrl}" target="blank"><img src="${stories[i].fields.thumbnail}" class="stories__story-thumbnail"/><h3 class="stories__story-headline">${stories[i].webTitle}</h3><p class="stories__story-trail">${stories[i].fields.trailText}</p></a>`
    ol.appendChild(li)  
  }
  // Clear out any existing content, then append the ol element we've just built
  panel.innerHTML = ""
  panel.appendChild(ol)
}

// If we don't get a response from the API, or can't parse it, let the user know
function apologiseToUser(panel){
  panel.innerHTML = userErrorMessage
}