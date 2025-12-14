import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";


/* global MusicKit */
function App() {
  const musicPlaylists = `https://api.music.apple.com/v1/me/library/playlists`; // Example MusicKit API endpoint
  const documentRef = useRef(document);
  const button = documentRef.current.getElementById("image");
  const rangeSlider = documentRef.current.getElementById("myRange");
  var count = 0;
  const [sliderValue, setSliderValue] = useState("");
const [myPlaylists, setMyPlaylists] = useState([]);


  let [searchParams, setSearchParams] = useSearchParams();

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
    if (count < 2) {
      const instance = MusicKit.getInstance();
      if (sliderValue == "200" && instance.authorize) {
        instance.unauthorize();
        console.log("slider maxed");
        if (!instance.isAuthorized) {
          console.log("not authorized");
          setSliderValue("200");
          rangeSlider.style.opacity = "0.2";
          button.style.opacity = "0.6";
          await instance
            .authorize()
            .then(function (token) {
              setSearchParams("");
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
            setSearchParams("");
            window.location.href +=
              "?music-user-token=" + encodeURIComponent(token);
            //const playlists = instance.api.music("v1/me/library/playlists");
          })
          .catch(function (err) {
            console.error(err);
          });
        return setSliderValue("200");
      }
    }
  }

  function getPlaylists() {
    const userToken = searchParams.get("music-user-token");
    const decodedToken = decodeURIComponent(userToken);
    console.log(decodedToken);
    const getToken = sessionStorage.getItem("devtoken");

    axios
      .get(musicPlaylists, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Music-User-Token": `${decodedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response; // Parse the response body as JSON
      })
      .then((data) => {
        setMyPlaylists(data.data)
        // Process the playlist data here
        console.log("myPlaylists:", myPlaylists);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });
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
              onClick={Click}
            />
          </div>
          <div className="textdiv">
            <nav>
              <Link to="/playlists" state={myPlaylists}>
                <button
                  type=" button"
                  onMouseOver={getPlaylists}
                  id="image"
                ></button>
              </Link>
            </nav>
          </div>
        </div>
        <p>
          Click the end of the slider to connect your Apple Music account then
          press Connect!
        </p>
      </div>
    </div>
  );
}

export default App;
