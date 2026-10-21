import { useEffect } from "react";
import L from "leaflet";
import translations from './translations'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap 
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const incidentIcon = L.divIcon({
  className: "incident-map-icon",
  html: `
    <div class="incident-map-marker">
      !
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// const services = [
//   {
//     name: "Support Centre 1",
//     type: "Hospital",
//     position: [4.385, 100.980]
//   },
//   {
//     name: "Support Centre 2",
//     type: "Police Station",
//     position: [4.400, 100.990]
//   }
// ];

function RecenterMap({
  latitude,
  longitude,
  searchedPosition,
  recenterTrigger
}) {
  const map = useMap();

  useEffect(() => {
    if (searchedPosition) {
      map.setView(searchedPosition, 15);
    } else if (latitude && longitude) {
      map.setView([latitude, longitude], 15);
    }
  }, [
    latitude,
    longitude,
    searchedPosition,
    recenterTrigger,
    map
  ]);

  return null;
}

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export default function SupportMap({ 
  latitude, 
  longitude, 
  searchedPosition,
  recenterTrigger, 
  incidents,
  language 
}) {

  const t = translations[language] || translations.ENG

const translateIncidentType = (type) => {
  const typeMap = {
    Assault: "assault",
    Robbery: "robbery",
    Rape: "rape",
    Murder: "murder",
    "Sexual Harassment": "sexualHarassment"
  }
  const key = typeMap[type]
  return key ? t.incidentTypes[key] : type
}

  const translateStatus = (status) => {
    if (status === "Verified") return t.common.verified
    if (status === "Pending") return t.common.pending
    return status
  }

  const translateTime = (time) => {
    if (language === "ENG") return time
    return time
      .replace("Today", t.common.today)
      .replace("Yesterday", t.common.yesterday)
  }

  return (
    <MapContainer
      center={
        latitude && longitude
          ? [latitude, longitude]
          : [4.385, 100.980]
      }
      zoom={13}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <ResizeMap />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap
        latitude={latitude}
        longitude={longitude}
        searchedPosition={searchedPosition}
        recenterTrigger={recenterTrigger}
      />
      
      // USER LOCATION
      {latitude && longitude && (
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{t.locationPage.yourLocation}</strong>
          </Popup>
        </Marker>
      )}

      {/* INCIDENT MARKERS */}
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[
            incident.latitude,
            incident.longitude
          ]}
          icon={incidentIcon}
        >
        <Popup>
          <strong>{translateIncidentType(incident.type)}</strong>
          <br />
          {incident.location}
          <br />
          {translateTime(incident.time)}
        </Popup>
        </Marker>
      ))}

      // SUPPORT SERVICES
      {/* {services.map((service, index) => (
        <Marker
          key={index}
          position={service.position}
        >
          <Popup>
            <strong>{service.name}</strong>
            <br />
            {service.type}
          </Popup>
        </Marker>
      ))} */}
    </MapContainer>
  );
}
