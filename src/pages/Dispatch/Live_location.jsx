import React, { useEffect } from 'react';
import { loadBingApi, Microsoft } from './BingMapLoader.ts';

function Live_location() {
  useEffect(() => {
    loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
      let map = new Microsoft.Maps.Map('#myMap');
      console.log('map', map);
      initMap(map);
    });
  });

  const initMap = (map) => {
    //Load the spatial math module
    Microsoft.Maps.loadModule('Microsoft.Maps.SpatialMath', function () {
      //Request the user's location
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log('position', position);
        var loc = new Microsoft.Maps.Location(
          position.coords.latitude,
          position.coords.longitude
        );
        console.log('loc', loc);

        //Create an accuracy circle
        var path = Microsoft.Maps.SpatialMath.getRegularPolygon(
          loc,
          position.coords.accuracy,
          50,
          Microsoft.Maps.SpatialMath.Meters
        );
        var poly = new Microsoft.Maps.Polygon(path);
        map.entities.push(poly);

        //Add a pushpin at the user's location.
        var pin = new Microsoft.Maps.Pushpin(loc);
        map.entities.push(pin);

        //Center the map on the user's location.
        map.setView({ center: loc, zoom: 15 });
      });
    });
  };
  return (
    <>
      <h1>Live Location</h1>
      <div
        id="myMap"
        style={{ position: 'relative', width: '600px', height: '400px' }}
      ></div>
    </>
  );
}

export default Live_location;
