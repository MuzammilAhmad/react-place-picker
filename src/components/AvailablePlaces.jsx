import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';


export default function AvailablePlaces({ onSelectPlace }) {
  const[isFetching, setIsFetching] = useState(false);
  const[availablePlaces, setAvailablePlaces] = useState([]);
  const[error, setError] = useState();


  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true);

      try{
        
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) =>{
          const sortedPlaces = sortPlacesByDistance(
            places, 
          position.coords.latitude, 
          position.coords.longitude )
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch(error){
      setError({
        message: error.message || "Could not fetch the places."
      });
      setIsFetching(false);
      }
    }

  fetchPlaces();
  },[]);
 
  if(error){
    return <Error title= "An error Occurred!" message={error.message}></Error>;
  }
  return (
    <Places
      title="Available Places"
      isLoading={isFetching}
      loadingText="Fetching places data..."
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
