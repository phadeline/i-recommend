var button = document.getElementById("myRange");

button.addEventListener("change", async function () {
    // Call configure() to configure an instance of MusicKit on the Web.
    console.log("2");
      try {
        await MusicKit.configure({
          developerToken: "",
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
    const music = MusicKit.getInstance();

   
  });




