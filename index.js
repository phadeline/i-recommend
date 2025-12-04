var button;
button = document.getElementById("myRange");



fetch("http://localhost:8000") // Replace with your backend endpoint
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

    // Set a timeout to refresh the page after 1 second (1000 milliseconds)
    setTimeout(function() {
      location.reload();
    }, 1000);
  }
});

document.addEventListener("musickitloaded", async function () {
  // Call configure() to configure an instance of MusicKit on the Web.

  //const finalDevToken = myDevToken.replace(/"/g, '')
  try {
    console.log(myDevToken);
    await MusicKit.configure({
      developerToken: myDevToken,
      app: {
        name: "irecommend",
      },
    });
    console.log("success");
  } catch (err) {
    console.log(err);
    // Handle configuration error
  }

  // MusicKit instance is available
  let instance = MusicKit.getInstance();

  

  button.addEventListener("change", function () {
    if (this.value == this.max) {
         instance.authorize().then(function (token) {
        window.location.href += "?music-user-token=" + encodeURIComponent(token)
      });
    }else {
      console.log("Not authorized");
    }
  }

  );
});  
