import React from "react";
import "./App.css";
function App() {
  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to i-Recommend</h1>
      <div className="card" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="titlebox" style={{ marginBottom: "20px" }}>
          <h1 id="title">iRecommend</h1>
        </div>
        <div className="connectbox" style={{ marginTop: "20px" }}>
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
