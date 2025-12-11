import React, { useEffect, useState, useRef, use } from "react";
import "./App.css";
import axios from "axios";
/* global MusicKit */
function App() {
  const documentRef = useRef(document);
  const button = documentRef.current.getElementById("image");
  const rangeSlider = documentRef.current.getElementById("myRange");
  var count = 0;
  const [sliderValue, setSliderValue] = useState(20);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/token", (e) => {
        e.preventDefault();
      })
      .then((response) => {
        if (response.status == 200) {
          console.log("Token fetched successfully");
          return response.data;
        } else if (response.status != 200) {
          console.error("Failed to fetch token");
        }
      })
      .then((data) => {
        sessionStorage.setItem("devtoken", data.token);
      })
      .catch((error) => {
        console.error(error);
      });


}, []);

  useEffect(() => {
    async function handleMouseMove(event) {
      event.preventDefault();
      if (count < 1) {
        console.log("musickitloaded event fired");
        try {
          // Call configure() to configure an instance of MusicKit on the Web.
          await MusicKit.configure({
            developerToken: sessionStorage.getItem("devtoken"),
            app: {
              name: "irecommend",
            },
          });
          console.log(`success ${sessionStorage.getItem("devtoken")}`);
        } catch (err) {
          console.log(err);
          // Handle configuration error
        }
        count++;
      }
    }
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


    async function Click(event) {
      event.preventDefault();
      //this refers to the button element
      const instance = MusicKit.getInstance();
      if (sliderValue == "200" && instance.authorize) {
        console.log("button clicked");
         instance.unauthorize();
        console.log("slider maxed");
        rangeSlider.style.opacity = "0.2";
        button.style.opacity = "0.6";
        if (!instance.isAuthorized) {
          console.log("not authorized");
          await instance
            .authorize()
            .then(function (token) {
              window.location.href +=
                "?music-user-token=" + encodeURIComponent(token);
              //const playlists = instance.api.music("v1/me/library/playlists");
            })
            .catch(function (err) {
              console.error(err);
            });
          }
      } else if (sliderValue !== "200") {
          alert("Please click to the end of slider before connecting.");
        } else {
          console.log("not authorized2");
          await instance
            .authorize()
            .then(function (token) {
              window.location.href +=
                "?music-user-token=" + encodeURIComponent(token);
              //const playlists = instance.api.music("v1/me/library/playlists");
            })
            .catch(function (err) {
              console.error(err);
            });
        }
    }
   
 

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to i-Recommend</h1>
      <div className="card">
        <div className="titlebox">
          <h1 id="title">iRecommend</h1>
        </div>
        <div className="connectbox">
          <div>
            <input
              type="range"
              title="Click at end of slider and press Connect"
              min="0"
              max="200"
              value={sliderValue}
              className="slider"
              id="myRange"
              onChange={(event) => {
                setSliderValue(event.target.value);
              }}
            />
          </div>
          <div className="textdiv">
            <button
              type=" button"
              id="image"
              onClick={Click}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
