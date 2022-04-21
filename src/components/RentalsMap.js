import React, { useEffect, useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

function RentalsMap({ locations, google, setHighLight }) {
  const [center, setCenter] = useState();
  useEffect(() => { 
    var arr = Object.keys(locations);
    var getLat = (key) => locations[key]['lat'];
    var avgLat = arr.reduce((a, c) => a + Number(getLat(c)), 0) / arr.length;

    var getLong = (key) => locations[key]['long'];
    var avgLong = arr.reduce((a, c) => a + Number(getLong(c)), 0) / arr.length;

    setCenter({ lat: avgLat, lng: avgLong });

  },[locations])
  return (
    <>
      {
        center && (
          <Map 
          google={google}
          containerStyle={{
            width: "50vw",
            height: "calc(100vh - 135px)",
          }}
          center={center}
          zoom={13}
          disabledDefaultUI={true}
          >
            {
              locations.map((cords, i) => (
                <Marker position={cords} onClick={() => setHighLight(i)} />
              ))
            }
          </Map>
        )
      }
    </>
  );
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyBml6k3FeVCf4MhLOqdf9a8wXBr7XQhVBc'})(RentalsMap);
