import { useLocation } from "react-router-dom";




const PlaylistsLists = () => {
const location = useLocation();
const myPlaylists = location.state || {};

console.log(`Hello ${myPlaylists.data[0].attributes.name}`);
  
return(

    <div>
    <h1>Hello {myPlaylists.data[0].attributes.name} </h1>
    <h1>Hello {myPlaylists.data[1].attributes.name} </h1>
    </div>

)

}

export default PlaylistsLists;
