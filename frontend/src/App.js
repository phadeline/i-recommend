import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
//import "../../frontend/"



/* global MusicKit */
function App() {
  const musicPlaylists = `https://api.music.apple.com/v1/me/library/playlists`; // Example MusicKit API endpoint
  const documentRef = useRef(document);
  const button = documentRef.current.getElementById("image");
  const rangeSlider = documentRef.current.getElementById("myRange");
  var count = 0;
  const [sliderValue, setSliderValue] = useState("15");
const [myPlaylists, setMyPlaylists] = useState([]);

  let [searchParams, setSearchParams] = useSearchParams();
     const userToken = searchParams.get("music-user-token");
const decodedToken = decodeURIComponent(userToken);
  

//http://localhost:8000/token
  useEffect(() => {

    async function getToken(){
     
    const response = await axios.get("https://i-recommend-289e22b5c5f5.herokuapp.com/token", (e) => {
        e.preventDefault();
      })
      try{
        sessionStorage.removeItem("devtoken");
        sessionStorage.setItem("devtoken", response.data);
        console.log(response.data)
      }
      catch(error) {
        console.error("your Error: " + error);
      };
  }
    getToken();
    ;}, [sessionStorage.getItem("devtoken")]);



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
          console.log("not a success: "+ err);
          // Handle configuration error
        }
        count++;
        console.log("in handlesmousemove: " + count);
       document.removeEventListener("mousemove", handleMouseMove);
   
    }
    
    document.addEventListener("mousemove", handleMouseMove);


   
  }, []);



  async function Click(event) {
    
    event.preventDefault();
    //this refers to the button element
   
      const instance = MusicKit.getInstance();
      if (sliderValue == "200" && instance.authorize) {
        instance.unauthorize();
        console.log("slider maxed");
        if (!instance.isAuthorized) {
          console.log("not authorized");
          setSliderValue("200");
          rangeSlider.style.opacity = "0.2";
          rangeSlider.value = "200";
          await instance
            .authorize()
            .then(function (token) {
               
              setSearchParams("");
              window.location.href +=
                "?music-user-token=" + encodeURIComponent(token);
              //const playlists = instance.api.music("v1/me/library/playlists");
              
              button.style.display = "flex";
             

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
  
  count++;
  console.log("in instance event: " + count);
  }


  
 

  async function getPlaylists(event) {
    event.preventDefault();
    console.log(decodedToken);
    const getToken = sessionStorage.getItem("devtoken");
   

    const response = await axios
      .get(musicPlaylists, {
        headers: {
          "Authorization": `Bearer ${getToken}`,
          "Music-User-Token": `${decodedToken}`,
          "Content-Type": "application/json",
        },
      })
      try{
        setMyPlaylists(response.data)
        // Process the playlist data here
        console.log("myPlaylists:", myPlaylists);
      }
      catch(error) {
        console.error("Error fetching playlists:", error);
      };

      
  }
  
 






  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h1 className="welcome" style={{ textAlign: "center" }}>Welcome to i-Recommend</h1>
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
              <Link to={`/playlists/`}  state={myPlaylists}>
                <button style={{display: "flex"}}
                  type=" button"
                  onClick={getPlaylists}
                  id="image"
                ></button>
              </Link>
            </nav>
          </div>
        </div>
        <div ><p>
          Click the end of the slider to connect your Apple Music account. 
        </p>
        <p>Then press Connect.</p>
        </div>
        
      </div>
    </div>
  );
}

export default App;
