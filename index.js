var button;
var data;
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
  MusicKit.getInstance();
});
