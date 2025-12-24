import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../../src/styles/playlistpage.css";
import React, { useState } from "react";
import axios from "axios";

const PlaylistsLists = () => {
  const location = useLocation();
  const myPlaylists = location.state.myPlaylists || {};
  const decodedToken = location.state.decodedToken || {};
  const getToken = sessionStorage.getItem("devtoken");
  const [myMusicData, setMyMusicData] = useState([]);
  //console.log(`Hello ${myPlaylists.data[0].attributes.name}`);

  async function OnePlaylist(id) {
    console.log(id);
    try{
    await axios
      .get(`https://api.music.apple.com/v1/catalog/us/playlists/${id}/tracks`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Music-User-Token": `${decodedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
       console.log(response.data)
       return response.data
      
      }).then((data)=>{setMyMusicData(data)})
    } catch(error) {
        console.log(error);
      };
  }
  console.log(myMusicData);
  return (
    <div className="playlistbackground">
      <h1 className="Header">Select A Playlist To View Recommended Songs</h1>
      <ul className="AllPlaylists">
        {myPlaylists.data.map((playlist) => (
          
            <Link
            
              style={{ textDecoration: "none", color: "white" }}
              to={`/playlists/${playlist.id}`}
              state={{myMusicData: myMusicData}} 
              
              
            >
             <li
                
                onMouseEnter={() =>
                  OnePlaylist(playlist.attributes.playParams.globalId)
                }
              >
                {playlist.attributes.name}
              </li>
            </Link>
            
         
        ))}
      </ul>
    </div>
  );
};

export default PlaylistsLists;
