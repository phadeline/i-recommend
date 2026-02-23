{genres ? (genres.data?.map((song)=>(
            <p className="recommendedArtist" ref={playMusic} key={song.attributes.id} onClick={playSongPreview(song.attributes.playParams.id)}>{song.attributes.artistName}</p>))) : (<p>LOADING...</p>)
           (<p>LOADING</p>)}