
var button;
var data;
button = document.getElementById("myRange");

fetch('http://localhost:3000') // Replace with your backend endpoint
  .then(response => {
    if (!response.ok) { // Check for successful response (status code 2xx)
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response body as JSON
  })
  .then(data => {
   var stringToken = JSON.stringify(data);
   console.log(stringToken);
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
    
      try {
        console.log(sessionStorage.getItem("devtoken"));
        await MusicKit.configure({
          developerToken: sessionStorage.getItem("devtoken"),
          app: {
            name: "applemusic",
            build: "25.11.1",
          },
        });
        console.log("success");
      } catch (err) {
        console.log(err);
        // Handle configuration error
      }
   

    // MusicKit instance is available
   MusicKit.getInstance();

   
  }});


