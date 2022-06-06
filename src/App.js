import React, { useEffect, useRef } from "react";
import Layout from "./layout/Layout";
import { Dashboard, OwnerForm } from "./pages";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { DispatchManager_Routes } from "./Routes/DispatchManager_Routes";
import { NotFound, Customers, PublicPages, Unauthorized } from "./pages";
import DispatchAction from "./redux/actions/DispatchAction";
import WebSocketAction from "./redux/actions/webSocketAction";
import { toast } from "react-toastify";
import { loadBingApi, Microsoft } from "./pages/Dispatch/BingMapLoader.ts";
import ProtectedRoute from "./Routes/ProtectedRoute";
import useAuth from "./hooks/useAuth";
function App() {
  const socketDataStore = useSelector((state) => state.DispatchReducer.socket);
  const dispatch = useDispatch();
  const mapRef = useRef();
  const Auth = useAuth();
  console.log("Auth", Auth);

  useEffect(() => {
    if (!socketDataStore && Auth.auth.idToken) {
      let socket = new WebSocket(process.env.REACT_APP_API_WS);
      socket.onopen = function (e) {
        let data = { IdToken: Auth.auth.idToken };
        socket.send(JSON.stringify(data));
        dispatch(DispatchAction.setSocket(socket));
      };

      socket.onmessage = function (event) {
        let message = JSON.parse(event.data);
        console.log("message", message);
      };
      socket.onerror = function (event) {
        let id = localStorage.getItem('idToken');
        if (id) {
          let socket = new WebSocket(process.env.REACT_APP_API_WS);
          socket.onopen = function (e) {
            let data = { IdToken: Auth.auth.idToken };
            socket.send(JSON.stringify(data));
            dispatch(DispatchAction.setSocket(socket));
          };
        }
      };
      socket.onclose = function (event) {
        let id = localStorage.getItem("idToken");
        if (id) {
          let socket = new WebSocket(process.env.REACT_APP_API_WS);
          socket.onopen = function (e) {
            let data = { IdToken: Auth.auth.idToken };
            socket.send(JSON.stringify(data));
            dispatch(DispatchAction.setSocket(socket));
          };
        }
      };
    }
  }, []);
  if (socketDataStore) {
    socketDataStore.onmessage = function (event) {
      let message = JSON.parse(event.data);
      console.log("message", message);
      switch (message.type) {
        case "driver_sos":
          {         
            toast.warn(`${message?.message?.driver_alert===true?`Driver raised 'SOS'`:'Driver Canceled SOS'}`, {
              position: "top-center",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              toastClassName: "dark-toast",
            });

            dispatch(WebSocketAction.changeSosStatus(message));
          }
          break;
        case "driver_current_location":
          {
            dispatch(WebSocketAction.setSocketDriverLocation(message));
          }
          break;
        case "get_current_location":
          {
           
            navigator.geolocation.getCurrentPosition(function (position) {
              loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
                var map = new Microsoft.Maps.Map(mapRef.current);
                Microsoft.Maps.loadModule("Microsoft.Maps.Search", function () {
                  var searchManager = new Microsoft.Maps.Search.SearchManager(
                    map
                  );
                  var reverseGeocodeRequestOptions = {
                    location: new Microsoft.Maps.Location(
                      position?.coords?.latitude,
                      position?.coords?.longitude
                    ),
                    callback: function (answer) {
                      console.log("answer", answer);
                      socketDataStore.send(
                        JSON.stringify({
                          type: "send_driver_location",
                          latitude: position?.coords?.latitude,
                          longitude: position?.coords?.longitude,
                          address: answer?.address?.formattedAddress,
                          dispatch: message?.message?.dispatch,
                          requested_by: [...message?.message?.requested_by],
                          zip_code: answer?.address?.postalCode,
                          city: answer?.address?.locality
                        })
                      );
                    },
                  };
                  searchManager.reverseGeocode(reverseGeocodeRequestOptions);
                })
              })
            });
          }
          break;
        case 'sos_resolved': {
          toast.warn(`SOS Resolved!`, {
            position: 'top-center',
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastClassName: 'dark-toast',
          });
          dispatch(WebSocketAction.resoleSos (message));
        }
        default:
          return null;
      }
    };

    socketDataStore.onclose = function (event) {
      let id = localStorage.getItem("idToken");
      if (id) {
        let socket = new WebSocket(process.env.REACT_APP_API_WS);
        socket.onopen = function (e) {
          let data = { IdToken: id };
          socket.send(JSON.stringify(data));
          dispatch(DispatchAction.setSocket(socket));
        };
      }
    };
  }
  return (
    <>
      <div ref={mapRef} className="map" />

      <Routes>
        <Route path="/login" element={<PublicPages />} />
        <Route path="/forgotpassword" element={<PublicPages />} />
        <Route path="/reset" element={<PublicPages />} />
        <Route path="/contactUs" element={<PublicPages />} />
        <Route path="/reset_sent" element={<PublicPages />} />
        <Route path="/reset_sent_success" element={<PublicPages />} />
        <Route path="/challenges" element={<PublicPages />} />
        <Route path="/OwnerForm" element={<OwnerForm />} />
        <Route path="/aaa" element={<Dashboard />} />

        <Route path="/" element={<Layout />}>
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin",
                  "DO",
                  "DM",
                  "D",
                  "TL",
                  "DISP",
                  "CO",
                  "B",
                ]}
              />
            }
          >
            {DispatchManager_Routes.map(({ path, component }, key) => (
              <Route path={path} element={component} key={key} />
            ))}
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/customers" element={<Customers />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
