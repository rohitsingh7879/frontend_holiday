import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, useRef } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const LocalMapContainer = ({ portDetail }) => {
  const [hoverInfo, setHoverInfo] = useState(null);
  const mapRef = useRef(null);
  const filterPortDetails = portDetail?.filter(
    (port) => port?.longitude && port?.latitude
  );
  console.log("portDetail---", filterPortDetails);
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
          longitude: filterPortDetails?.[0]?.longitude || 0,
          latitude: filterPortDetails?.[0]?.latitude || 0,
          zoom: 4,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {filterPortDetails?.map((ports, idx) => {
          const { latitude = 0, longitude = 0, port } = ports || {};
          // if (latitude && longitude) {
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
                  onMouseEnter={() =>
                    setHoverInfo({ port, latitude, longitude })
                  }
                  onMouseLeave={() => setHoverInfo(null)}
                />
              </Marker>
            );
          // }
        })}

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="top"
          >
            {hoverInfo.port}
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default LocalMapContainer;
