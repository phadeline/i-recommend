var button = document.getElementById("myRange");
var connectTest = document.getElementById("image");
const musicPlaylists = `https://api.music.apple.com/v1/me/library/playlists`; // Example MusicKit API endpoint
let myPlaylists;
function getPlaylists() {

  const userToken = new URLSearchParams(window.location.search).get("music-user-token");
  const decodedToken = decodeURIComponent(userToken);
  console.log(decodedToken);
  const getToken = sessionStorage.getItem("devtoken");
  fetch(musicPlaylists, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken}`,
      "Music-User-Token": `${decodedToken}`,
      "Content-Type": "application/json"
    },
  })
    .then((response) =>{
    if (!response.ok) {
      // Check for successful response (status code 2xx)
      throw new Error(response.statusText);
    }
    return response.json(); // Parse the response body as JSON
  })  
    .then((data) => {
      
  
   myPlaylists = data;
      // Process the playlist data here
      console.log("myPlaylists:", myPlaylists);
    })
    .catch((error) => {
      console.error("Error fetching playlists:", error);
    });
}

fetch("/token") // Replace with your backend endpoint
  .then((response) => {
    if (!response.ok) {
      // Check for successful response (status code 2xx)
      throw new Error("Network response was not ok");
    }
    return response.json(); // Parse the response body as JSON
  })
  .then((data) => {
    sessionStorage.setItem("devtoken", data.token);
    // Process the received data here
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

const myDevToken = sessionStorage.getItem("devtoken");

$(document).ready(function() {
  // Check if the page has already been refreshed in this session
  if (!sessionStorage.getItem('pageRefreshed')) {
    // Set a flag in session storage to indicate the page has been refreshed
    sessionStorage.setItem('pageRefreshed', 'true');

    // Set a timeout to refresh the page after 1 second (1000 milliseconds) because token might not be ready
    setTimeout(function() {
      location.reload();
    }, 1000);
  }
});

document.addEventListener("musickitloaded", async function (event) {
  // Call configure() to configure an instance of MusicKit on the Web.
 event.preventDefault();
 
  try {
   // console.log(myDevToken);
    await MusicKit.configure({
      developerToken: myDevToken,
      app: {
        name: "irecommend",
      },
    });
    console.log(`success ${myDevToken}`);
  } catch (err) {
    console.log(err);
    // Handle configuration error
  };

  // MusicKit instance is available
  let instance = MusicKit.getInstance();

  

 button.addEventListener("change", async function (event) {
  event.preventDefault();
    //this refers to the button element
   /* if(this.value > 10){
       $("#myRange").css("background-color", "blue");
    }*/
     if(this.max == this.value){
      console.log("button maxed");
      if( !instance.isAuthorized){
        console.log("not authorized");
     
         await instance.authorize().then(function (token) {
        window.location.href += "?music-user-token=" + encodeURIComponent(token);
        //const playlists = instance.api.music("v1/me/library/playlists");
      }).catch(function(err) {console.error(err)});
    
  
     }else{
        console.log("not authorized");
     
         await instance.authorize().then(function (token) {
        window.location.href += "?music-user-token=" + encodeURIComponent(token);
        //const playlists = instance.api.music("v1/me/library/playlists");
      }).catch(function(err) {console.error(err)});
    
  
     }}

  
} 
 );
})

connectTest.addEventListener("click", function (event) {
  event.preventDefault();
    //this refers to the button element
    
         getPlaylists();
  
  }
  )
  



