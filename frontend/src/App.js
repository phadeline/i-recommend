import React, { useEffect, useState, useRef, use, act } from "react";
import { useSearchParams, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { HashLink } from 'react-router-hash-link';

//import "../../frontend/"

/* global MusicKit */
function App() {
  const musicPlaylists = "https://api.music.apple.com/v1/me/library/playlists"; // Example MusicKit API endpoint
  const documentRef = useRef(document);
  const rangeSliderRef = useRef();
  //const button = documentRef.current.getElementById("image");
  const newButtonRef = useRef();
  var count = 0;
  const [sliderValue, setSliderValue] = useState(15);
  const [activates, setActivates] = useState(false);
  const [MyPlay, setMyPlay] = useState([]);
  let [searchParams, setSearchParams] = useSearchParams();
const navigate = useNavigate();

  useEffect(() => {
    async function getToken() {
      const response = await axios.get(
        "http://localhost:9000/token",
        (e) => {
          e.preventDefault();
        }
      );
      try {
        sessionStorage.removeItem("devtoken");
        sessionStorage.setItem("devtoken", response.data);
        console.log(response.data);
      } catch (error) {
        console.error("your Error: " + error);
      }
    }
    getToken();
  }, [sessionStorage.getItem("devtoken")]);

  useEffect(() => {
    async function handleMouseMove(event) {
      event.preventDefault();
      const myToken = sessionStorage.getItem("devtoken");

      console.log("musickitloaded event fired");
      try {
        // Call configure() to configure an instance of MusicKit on the Web.
        await MusicKit.configure({
          developerToken: myToken,
          app: {
            name: "irecommend",
          },
        });
        //console.log(`success ${sessionStorage.getItem("devtoken")}`);
      } catch (err) {
        console.log("not a success: " + err);
        // Handle configuration error
      }
count++;
      console.log("in handlesmousemove: " + count);
      document.removeEventListener("mousemove", handleMouseMove);
      
    }

    document.addEventListener("mousemove", handleMouseMove);
  }, [sessionStorage.getItem("devtoken")]);

  
 
  const Click = async () => {
  
  if(sessionStorage.getItem("devtoken")){

  const instance = await MusicKit.getInstance();

  console.log("click");

    
  if (rangeSliderRef.current.value === rangeSliderRef.current.max) {
    instance.unauthorize();
    setSearchParams("");
    try {
      const response = await instance.authorize();
      searchParams.delete("music-user-token");

      //put music user token as session storage
      window.location.href += "?music-user-token=" + encodeURIComponent(response);
     setActivates(true);
     setSliderValue(200);
     rangeSliderRef.current.style.opacity = 0.2;
      console.log("Authorized, music user token: " + response);
      console.log(activates);
    }
     
      catch (err) {
      console.log("Authorization error:", err);
    }
  }
};
  }


      const getPlaylists = async () => {
       
        const hash = location.hash;
        const queryString = hash.indexOf("?");
        console.log(hash)
        const newString = hash.substring(queryString);
        console.log(newString);
        const search = new URLSearchParams(newString);
        const decodedToken = search.get("music-user-token");

        console.log("decoded token " + decodedToken);
        const getToken = sessionStorage.getItem("devtoken");

        const response = await axios.get(musicPlaylists, {
          headers: {
             "Authorization": `Bearer ${getToken}`,
            "Music-User-Token": `${decodedToken}`,
            "Content-Type": "application/json",
          },
        });
        try {
          setMyPlay([response.data]);
       //   console.log(await response.data);
          console.log("Myplaylists: " + MyPlay);
           setSearchParams("");
        } catch (error) {
          console.error("Error fetching playlists:", error);
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
              title="Click at end of slider and press Connect"
              min={0}
              max={200}
              className="slider"
              id="myRange"
              ref={rangeSliderRef}
              defaultValue={sliderValue}
              onClick={Click}
              onChange={(event) => {
                setSliderValue(event.target.value);
              }}
            />
          </div>
          <div className="textdiv">
         
              
                <button
                  disabled={activates ? false : true}
                  type=" button"
                  ref={newButtonRef}
                 onMouseEnter={(event) => {
                  event.preventDefault();
      getPlaylists();
      navigate("playlists", { state: { MyPlay: MyPlay } })
    }}
   
                  id="image"
                ></button>
           
         
          </div>
        </div>
        <div>
          <p>
            DoubleClick the end of the slider to connect your Apple Music
            account.
          </p>
          <p>Then press Connect.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
