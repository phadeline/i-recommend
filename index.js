
var button;
var data;
button = document.getElementById("myRange");

fetch('http://localhost:8000') // Replace with your backend endpoint
  .then(response => {
    if (!response.ok) { // Check for successful response (status code 2xx)
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response body as JSON
  })
  .then(data => {
   var stringToken = JSON.stringify(data.token);
   return stringToken;
    // Process the received data here
  }).then(stringToken => {
    sessionStorage.setItem("devtoken", stringToken)
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

button.addEventListener("change", async function () {
    // Call configure() to configure an instance of MusicKit on the Web.
  if(this.value == this.max){
    console.log(JSON.parse(sessionStorage.getItem("devtoken")));
      try {
        await MusicKit.configure({
          developerToken: JSON.parse(sessionStorage.getItem("devtoken")),
          app: {
            name: "applemusic",
            build: "25.11.1",
          },
        });
        console.log("success");
      } catch (err) {
        console.log("err");
        // Handle configuration error
      }
   

    // MusicKit instance is available
   MusicKit.getInstance();

   
  }});


