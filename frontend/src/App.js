import React, { useEffect, useState, useRef, use } from "react";
import { useSearchParams, Link, NavLink, useLocation } from "react-router-dom";
import "./App.css";
import axios from "axios";
//import "../../frontend/"

/* global MusicKit */
function App() {
  const musicPlaylists = "https://api.music.apple.com/v1/me/library/playlists"; // Example MusicKit API endpoint
  const documentRef = useRef(document);
  const rangeSliderRef = useRef();
  const button = documentRef.current.getElementById("image");
  const newButtonRef =  useRef();
  var count = 0;
  const [sliderValue, setSliderValue] = useState(15);

  let [searchParams, setSearchParams] = useSearchParams();

  //http://localhost:8000/token
  useEffect(() => {
    async function getToken() {
      const response = await axios.get(
        "https://i-recommend-289e22b5c5f5.herokuapp.com/token",
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



  useEffect(() => {
    if (sessionStorage.getItem("devtoken") !== "") {
      console.log("do something");
 
if (sessionStorage.getItem("devtoken") !== "") {

      const Click = async (event) => {
        event.preventDefault();
       const instance = await MusicKit.getInstance();
        console.log("click");
        if (sliderValue === "200") {
          instance.unauthorize();
          console.log("slider maxed");
            try {
              console.log("not authorized");
              setSliderValue(200);
              documentRef.current.getElementById("myRange").style.opacity =
                "0.2";
             instance.authorize()
                .then(function (token) {
                  setSearchParams("");
                  window.location.href +=
                    "?music-user-token=" + encodeURIComponent(token);
                  //const playlists = instance.api.music("v1/me/library/playlists");

                  button.style.display = "flex";
                })
                .catch((err) => {
                  console.error(err);
                });
            } catch (error) {
              console.error("Authorization error:", error);
            }
          

          count++;
          console.log("in instance event: " + count);
        }
       
      
      };
    rangeSliderRef.current.addEventListener("click", Click);
    }
       
    }
  }, [sliderValue]);

  /*const [MyPlay, setMyPlay] = useState([]);
  
  useEffect(() => {
    

    const getPlaylists = async(event) => {
      const hash = location.hash;
    const queryStringIndex = hash.indexOf("?");
    const queryString = hash.substring(queryStringIndex);
    const search = new URLSearchParams(queryString);
   const decodedToken = search.get("music-user-token"); 
      console.log(decodedToken);
      const getToken = sessionStorage.getItem("devtoken");
      event.preventDefault();

    const response =  await axios
        .get(musicPlaylists, {
          headers: {
            Authorization: `Bearer ${getToken}`,
            "Music-User-Token": `${decodedToken}`,
            "Content-Type": "application/json",
          },
        })
        try{
           setMyPlay(await response.data)
        }
        catch(error){
          console.error("Error fetching playlists:", error);
        }
    }
   const newButtonRef =  useRef();
   newButtonRef.current.addEventListener("click", getPlaylists)

  }, [MyPlay]);*/

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
              onChange={(event) => {
                setSliderValue(event.target.value);
              }}
            />
          </div>
          <div className="textdiv">
            <nav>
              <Link to={"/playlists"} /*state={{ MyPlay: MyPlay }}*/>
                <button
                  style={{ display: "none" }}
                  type=" button"
                  ref={newButtonRef}
                  id="image"
                ></button>
              </Link>
            </nav>
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
