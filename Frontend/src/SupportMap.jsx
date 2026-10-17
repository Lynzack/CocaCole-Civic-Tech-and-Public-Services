import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap 
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const services = [
  {
    name: "Support Centre 1",
    type: "Hospital",
    position: [4.385, 100.980]
  },
  {
    name: "Support Centre 2",
    type: "Police Station",
    position: [4.400, 100.990]
  }
];

function RecenterMap({ latitude, longitude }) {
  const map = useMap();

  if (latitude && longitude) {
    map.setView([latitude, longitude], 15);
  }

  return null;
}

export default function SupportMap({ latitude, longitude }) {
  return (
    <MapContainer
      center={
        latitude && longitude
          ? [latitude, longitude]
          : [4.385, 100.980]
      }
      zoom={13}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px"
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap
        latitude={latitude}
        longitude={longitude}
      />
      
      // USER LOCATION
      {latitude && longitude && (
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}

      // SUPPORT SERVICES
      {services.map((service, index) => (
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
      ))}
    </MapContainer>
  );
}
