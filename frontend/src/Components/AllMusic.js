import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../../src/styles/Carousel.css";

function AllMusic() {
  const location = useLocation();
  const decodedToken = location.state.decodedToken;
  const Name = location.state.Name;
  const [OnePlaylistData, setOnePlaylistData] = useState([]);
  //const url = window.location.hash;
  // console.log(url);
  //const UrlName = decodeURIComponent(url);
  //console.log(UrlName);
  //const finalglobalID = UrlName.replace("#/", "")
  const finalglobalID = location.state.globalId;
  //console.log(finalglobalID)
  const getToken = sessionStorage.getItem("devtoken");
  const playlistTracksUrl = `https://api.music.apple.com/v1/catalog/us/playlists/${finalglobalID}/tracks`;

  useEffect(() => {
    console.log(finalglobalID);
    const FetchAll = async () => {
      try {
        const response = await axios.get(playlistTracksUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (response.status == 200) {
          console.log(response);
          setOnePlaylistData(response.data);
        }
      } catch (error) {
        console.log("here is the error: " + error);
      }
    };

    if (finalglobalID) {
      console.log(finalglobalID);
      FetchAll(finalglobalID);
    }
  }, [finalglobalID]);

  console.log(OnePlaylistData.length);

  return (
    <div>
      <div className="CarouselContainer">
        <h1 className="PlaylistTitle">Playlist: {Name}</h1>
        <div className="Carousel">
          <Carousel interval={null} style={{position:"relative"}}>
            {OnePlaylistData ? (
              OnePlaylistData.data?.map((song) => (
                <Carousel.Item key={song.id} style={{backgroundColor: "black"}} className="CarouselItem">
                  
                  <div>
                    <img
                      style={{ objectFit: "scale-down" }}
                      className="d-block w-100"
                      src={MusicKit.formatArtworkURL(
                        song.attributes.artwork,
                        200,
                        200
                      )}
                      alt="Image One"
                    />
                  </div>
                  <Carousel.Caption><div className="songsNames">
                    <h3 style={{fontSize:15}}>{song.attributes.artistName}</h3>
                    <p style={{fontSize:15 }}>{song.attributes.name}</p>
                  </div></Carousel.Caption>
                  
                </Carousel.Item>
              ))
            ) : (
              <p>Loading data...</p>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default AllMusic;
