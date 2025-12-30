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

  
  console.log(myMusicData);
  return (
    <div className="playlistbackground">
      <h1 className="Header">Select A Playlist To View Recommended Songs</h1>
      <ul className="AllPlaylists">
        {myPlaylists.data?.map((playlist) => (
          
            <Link
            
              style={{ textDecoration: "none", color: "white" }}
              to={`/OnePlaylist`}
              state={{ decodedToken:decodedToken, Name: playlist.attributes.name, globalId: playlist.attributes.playParams.globalId}}
              
              
            >
             <li key={playlist.id}>
                {playlist.attributes.name}
              </li>
            </Link>
            
         
        ))}
      </ul>
    </div>
  );
};

export default PlaylistsLists;
