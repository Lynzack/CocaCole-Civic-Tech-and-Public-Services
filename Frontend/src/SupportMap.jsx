import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
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

export default function SupportMap() {
  return (
    <MapContainer
      center={[4.385, 100.980]}
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
