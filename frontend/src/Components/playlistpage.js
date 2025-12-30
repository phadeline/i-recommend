import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../../src/styles/playlistpage.css";
import React, { useState } from "react";
import axios from "axios";

const PlaylistsLists = () => {
  const location = useLocation();
  const myPlaylists = location.state.myPlaylists || {};
  const [myMusicData, setMyMusicData] = useState([]);
  //console.log(`Hello ${myPlaylists.data[0].attributes.name}`);

  
  console.log(myMusicData);
  return (
    <div className="playlistbackground">
      <h1 className="Header">Select A Playlist To View Recommended Songs</h1>
      <ul className="AllPlaylists">
        {myPlaylists ? (
        
        myPlaylists.data.data.map((playlist) => (
          
            <Link
            
              style={{ textDecoration: "none", color: "white" }}
              to={`/OnePlaylist`}
              state={{ Name: playlist.attributes.name, globalId: playlist.attributes.playParams.globalId}}
              
              
            >
             <li key={playlist.id}>
                {playlist.attributes.name}
              </li>
            </Link>
            
         
        ))

      ) : (<p>LOADING...</p>)
        
      }
      </ul>
    </div>
  );
};

export default PlaylistsLists;
