import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../styles/playlistpage.css";
import React, { use, useState } from "react";
import axios from "axios";

const PlaylistsLists = () => {
  const location = useLocation();
  const MyPlays = location.state.MyPlays;
  console.log(MyPlays);


  
  //console.log(`Hello ${myPlaylists.data[0].attributes.name}`);

  return (
    <div className="playlistbackground">
      <h1 className="Header">Select A Playlist To View Recommended Songs</h1>
      <ul className="AllPlaylists">
        {MyPlays.meta.total ? (
        
        MyPlays.data?.map((playlist) => (
          
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
