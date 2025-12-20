import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../../src/styles/playlistpage.css";
import React, { useState } from "react";
import axios from "axios";

const PlaylistsLists = () => {
  const location = useLocation();
  const myPlaylists = location.state.myPlaylists || {};
  const decodedToken = location.state.decodedToken || {};
  const getToken = sessionStorage.getItem("devtoken");
  const [MusicData, setMusicData] = useState([]);
  console.log(`Hello ${myPlaylists.data[0].attributes.name}`);

  function OnePlaylist(id) {
    console.log(id);
    axios
      .get(`https://api.music.apple.com/v1/catalog/us/playlists/${id}/tracks`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Music-User-Token": `${decodedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        return setMusicData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="playlistbackground">
      <h1 className="Header">Select A Playlist To View Recommended Songs</h1>
      <ul className="AllPlaylists">
        {myPlaylists.data.map((playlist) => (
          <nav>
            <Link style={{textDecoration: "none", color: "white"}} to={`/playlists/${playlist.attributes.playParams.globalId}`} state={{MusicData:MusicData, decodedToken: decodedToken}}>
              <li
                key={playlist.id}
                onClick={() =>
                  OnePlaylist(playlist.attributes.playParams.globalId)
                }
              >
                {playlist.attributes.name}
              </li>
            </Link>
          </nav>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistsLists;
