import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, useRef } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const PortMap = ({ portDetail }) => {
  const [hoverInfo, setHoverInfo] = useState(null);
  const mapRef = useRef(null);
  // console.log('portDetail---',portDetail)

  useEffect(() => {
    // Listen for tab show (Bootstrap tab shown.bs.tab event or generic visibility)
    const tabEl = document.querySelector("#nav-bigship");
    const resizeMap = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };

    // If Bootstrap 5+ tab
    const handleTabShown = () => setTimeout(resizeMap, 200);

    if (tabEl) {
      tabEl.addEventListener("shown.bs.tab", handleTabShown);
    }

    // Backup: Use MutationObserver in case you're not using Bootstrap events
    const observer = new MutationObserver(() => {
      if (
        tabEl &&
        tabEl.classList.contains("show") &&
        tabEl.classList.contains("active")
      ) {
        setTimeout(resizeMap, 200);
      }
    });

    observer.observe(tabEl, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (tabEl) {
        tabEl.removeEventListener("shown.bs.tab", handleTabShown);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: portDetail?.[0]?.port?.longitude || 0,
          latitude: portDetail?.[0]?.port?.latitude || 0,
          zoom: 4,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {portDetail?.map((port, idx) => {
          const { latitude, longitude, name } = port?.port || {};
          return (
            <Marker
              key={idx}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="marker"
                style={{ width: 30, height: 30, cursor: "pointer" }}
                onMouseEnter={() => setHoverInfo({ name, latitude, longitude })}
                onMouseLeave={() => setHoverInfo(null)}
              />
            </Marker>
          );
        })}

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="top"
          >
            {hoverInfo.name}
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default PortMap;

// src/MapView.js
// MapView.jsx
// import React, { useRef, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// const DefaultIcon = L.icon({
//   iconUrl,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// const MapView = () => {
//   const mapRef = useRef();

//   useEffect(() => {
//     const handleShown = () => {
//       setTimeout(() => {
//         mapRef.current?.invalidateSize();
//       }, 200);
//     };

//     const tabTrigger = document.querySelector('#nav-bigship-tab');
//     tabTrigger?.addEventListener('shown.bs.tab', handleShown);

//     return () => {
//       tabTrigger?.removeEventListener('shown.bs.tab', handleShown);
//     };
//   }, []);

//   return (
//     <MapContainer
//       center={[51.505, -0.09]}
//       zoom={13}
//       style={{ height: '500px', width: '100%' }}
//       whenCreated={(mapInstance) => {
//         mapRef.current = mapInstance;
//       }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; OpenStreetMap contributors'
//       />
//       <Marker position={[51.505, -0.09]}>
//         <Popup>A sample marker</Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default MapView;
