import React, {useEffect, useRef} from "react";
import "./App.css";
import axios from "axios";
/* global MusicKit */
function App() {
const documentRef = useRef(document);
var instance = null;

  axios.get("http://localhost:8000/token",{
  }).then((response) => {
     if (response.status == 200) {
      console.log("Token fetched successfully");
      return response.data;
    }else if (response.status != 200){ 
      console.error("Failed to fetch token");
    }
  }).then(data => {
    sessionStorage.setItem("devtoken", data.token);
  }).
  catch((error) => {
    console.error(error);
  });


var count = 0;

useEffect(() => {  
async function handleMouseMove(event) {
  event.preventDefault();
  if(count < 1){
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
  };
   count++;
  // MusicKit instance is available
instance = MusicKit.getInstance();}
}


document.addEventListener("mousemove", handleMouseMove);
return() => {document.removeEventListener("mousemove", handleMouseMove)};

},[])

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to i-Recommend</h1>
      <div className="card" >
        <div className="titlebox" >
          <h1 id="title">iRecommend</h1>
        </div>
        <div className="connectbox" >
          <div>
            <input
              type="range"
              min="0"
              max="200"
              defaultValue="10"
              className="slider"
              id="myRange"
         
            />
          </div>
          <div className="textdiv">
            <button type=" button" id="image"></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
