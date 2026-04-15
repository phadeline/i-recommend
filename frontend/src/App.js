import React, { useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";

/* global MusicKit */
function App() {
  const musicPlaylists = "https://api.music.apple.com/v1/me/library/playlists";
  const rangeSliderRef = useRef();
  const newButtonRef = useRef();
  var count = 0;
  const [sliderValue, setSliderValue] = useState(15);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    async function getToken() {
      try {
        const response = await axios.get("/token", {
          headers: { "Content-Type": "application/json" },
        });
        sessionStorage.setItem("devtoken", response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
  }, []);

  if (hasFetched.current) return;

  useEffect(() => {
    async function handleMouseMove(event) {
      event.preventDefault();
      if (!sessionStorage.getItem("devtoken")) return;

      try {
        await MusicKit.configure({
          developerToken: sessionStorage.getItem("devtoken"),
          app: { name: "irecommend" },
        });
      } catch (err) {
        console.log("not a success: " + err);
      }
      count++;
      document.removeEventListener("mousemove", handleMouseMove);
    }
    document.addEventListener("mousemove", handleMouseMove);
  }, [sessionStorage.getItem("devtoken")]);

  const Click = async () => {
    sessionStorage.removeItem("music-user-token");
    setIsAuthorized(false);

    if (
      sessionStorage.getItem("devtoken") &&
      !sessionStorage.getItem("music-user-token")
    ) {
      const instance = await MusicKit.getInstance();

      if (rangeSliderRef.current.value === rangeSliderRef.current.max) {
        instance.unauthorize();

        try {
          const response = await instance.authorize();
          rangeSliderRef.current.style.opacity = 0.2;
          sessionStorage.setItem("music-user-token", response);

          // Only enable the button if we actually got a valid token back
          if (response && sessionStorage.getItem("music-user-token")) {
            setIsAuthorized(true);
            setSliderValue(200);
          }
        } catch (err) {
          console.log("Authorization error:", err);
          setIsAuthorized(false);
        }
      }
    }
  };

  const getPlaylists = async () => {
    const decodedToken = sessionStorage.getItem("music-user-token");
    const getToken = sessionStorage.getItem("devtoken");

    // Double-check tokens are present before making the call
    if (!decodedToken || !getToken) {
      console.error("Missing tokens — cannot fetch playlists.");
      setIsAuthorized(false);
      return;
    }

    try {
      const response = await axios.get(musicPlaylists, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Music-User-Token": decodedToken,
          "Content-Type": "application/json",
        },
      });
      navigate("playlists", { state: { MyPlays: response.data } });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setIsAuthorized(false);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h1 className="welcome" style={{ textAlign: "center" }}>
        Welcome to i-Recommend
      </h1>
      <div className="card">
        <div className="titlebox">
          <h1 id="title">iRecommend</h1>
        </div>
        <div className="connectbox">
          <div>
            <input
              type="range"
              title="Drag to end of the slider then press Connect."
              min={0}
              max={200}
              className="slider"
              id="myRange"
              ref={rangeSliderRef}
              defaultValue={sliderValue}
              onChange={Click}
            />
          </div>
          <div className="textdiv">
            <button
              disabled={!isAuthorized}
              type="button"
              ref={newButtonRef}
              onClick={getPlaylists}
              id="image"
            />
          </div>
        </div>
        <div>
          <p>Drag to the end of the slider to connect your Apple Music account.</p>
          <p>Then press Connect.</p>
        </div>
      </div>
    </div>
  );
}

export default App;