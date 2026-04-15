import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../styles/playlistpage.css";


const PlaylistsLists = () => {
  const location = useLocation();
  const MyPlays = location.state.MyPlays;
  const decodedToken = location.state.musictoken;
  console.log(MyPlays);


  


  return (
    <div className="playlistbackground">
      <h1 className="Header">Select A Playlist To View Recommended Songs</h1>
      <ul className="AllPlaylists">
        {MyPlays.meta.total ? (
        
        MyPlays.data?.map((playlist) => (
          <div >
            <Link
            
              style={{ textDecoration: "none", color: "white" }}
              to={`/OnePlaylist`}
              state={{ Name: playlist.attributes.name, decodedToken: decodedToken, globalId: playlist.attributes.playParams.globalId}}
              
              
            >
             <li key={playlist.id}>
                {playlist.attributes.name}
              </li>
            </Link>
            </div>
         
        ))

      ) : (<p>LOADING...</p>)
        
      }
      </ul>
    </div>
  );
};

export default PlaylistsLists;
