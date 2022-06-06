import React, { useRef, useEffect, useState } from 'react';
import { loadBingApi, Microsoft } from './BingMapLoader.ts';
// import { useSelector } from 'react-redux';
import Style from './dispatch.module.css';

const TripSheet = ({ dispatchDetails }) => {
  const mapRef = useRef();
  const mounted = useRef();
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');

  console.log('dispatchDetails', dispatchDetails);
  let wayPoints = [
    ...dispatchDetails[0].load.pickup_location,
    ...dispatchDetails[0].load.dropoff_location,
  ];
  console.log('waypoints', wayPoints);

  useEffect(() => {
    mounted.current = true;
    loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
      initDirection();
    });
    return () => {
      mounted.current = false;
    };
  }, []);

  function initDirection() {
    var map = new Microsoft.Maps.Map(mapRef.current);

    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function (e) {
      // Feed Details of Truck and load type and get directions
      var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(
        map
      );

      directionsManager.setRenderOptions({
        itineraryContainer: document.getElementById('printoutPanel'),
      });

      directionsManager.setRequestOptions({
        // routeMode : driving/truck/transit/walking
        routeMode: Microsoft.Maps.Directions.RouteMode.truck,

        vehicleSpec: {
          dimensionUnit: 'ft',
          weightUnit: 'lb',
          vehicleHeight: 5,
          vehicleWidth: 3.5,
          vehicleLength: 30,
          vehicleWeight: 30000,
          vehicleAxles: 3,
          vehicleTrailers: 2,
          vehicleSemi: true,
          vehicleMaxGradient: 10,
          vehicleMinTurnRadius: 15,
          vehicleAvoidCrossWind: true,
          vehicleAvoidGroundingRisk: true,
          vehicleHazardousMaterials: 'F',
          vehicleHazardousPermits: 'F',
        },

        //  To calculate the number of routes max 3
        maxRoutes: 3,

        //For Distance unit Change (km, miles)
        distanceUnit: Microsoft.Maps.Directions.DistanceUnit.miles,
      });

      wayPoints.map((item) => {
        var wp = new Microsoft.Maps.Directions.Waypoint({
          address: item.address.line_1,
        });

        directionsManager.addWaypoint(wp);
      });

      // Calculates directions based on waypoints
      directionsManager.calculateDirections();

      // This will help to Handle Distance and Time
      // addHandler(target:object, eventName:string, handler:function)
      // eventName are predefined
      Microsoft.Maps.Events.addHandler(
        directionsManager,
        'directionsUpdated',
        calculateTimeDistance
      );
      Microsoft.Maps.Events.addHandler(
        directionsManager,
        'directionsError',
        calculateTimeDistanceError
      );

      // To calculate Distance and Time
      function calculateTimeDistance(e) {
        //Get the current route index.
        var routeIdx = directionsManager.getRequestOptions().routeIndex;

        //Get the distance of the route, rounded to 2 decimal places.
        var distance = Math.round(
          (e.routeSummary[routeIdx].distance * 100) / 100
        );

        console.log(distance);
        // setBingMiles(distance);

        //Get the distance units used to calculate the route.
        var units = directionsManager.getRequestOptions().distanceUnit;

        var distanceUnits = '';

        if (units === Microsoft.Maps.Directions.DistanceUnit.km) {
          //If in kilometers
          distanceUnits = 'km';
        } else {
          //If in miles
          distanceUnits = 'miles';
        }

        //Time is in seconds, convert to minutes and round off.
        var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);

        // Hours are extracted
        var time_hrs = Math.trunc(time / 60);

        // Minutes Are Extracted
        var time_min = Math.round(time % 60);
        if (mounted.current) {
          setDistance(`${distance} ${distanceUnits}`);
          setDuration(
            `${time_hrs > 0 ? time_hrs + ' hr ' : ''} ${
              time_min > 0 ? time_min + ' min ' : ''
            }`
          );
        }
      }

      // to handle Error
      function calculateTimeDistanceError(e) {
        alert('Error: ' + e.message + '\r\nResponse Code: ' + e.responseCode);
      }
    });
  }
  return (
    <>
      <section className={Style.tripSheet_map}>
        <div ref={mapRef} className="map" style={{ display: 'block' }} />
        <div className={Style.distance_print_wrap}>
          <div className={Style.map_distance}>
            <div className={Style.path_wrap}>
              <p>Duration</p>
              <p>{duration}</p>
            </div>
            <div className={Style.path_wrap}>
              <p>Distance</p>
              <p>{distance}</p>
            </div>
          </div>
          <div
            id="printoutPanel"
            style={{ display: 'block' }}
            className={Style.tripSheetWrap}
          />
        </div>
      </section>
    </>
  );
};

export default TripSheet;
