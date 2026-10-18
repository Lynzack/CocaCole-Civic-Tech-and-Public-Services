import { useState, useEffect } from "react";
import {
  Hand,
  Wallet,
  Skull,
  AlertTriangle,
  ShieldAlert,
  FileText,
  MapPin,
  CalendarDays,
  Clock,
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
  Navigation,
  Upload,
  X,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./ReportIncident.css";

// Incident categories
const incidentTypes = [
  { id: "assault", label: "Assault", icon: Hand },
  { id: "robbery", label: "Robbery", icon: Wallet },
  { id: "rape", label: "Rape", icon: ShieldAlert},
  { id: "murder", label: "Murder", icon: Skull },
  { id: "other", label: "Other", icon: FileText },
];

// Example initial map position: UTP, Seri Iskandar.
// This is only the map's initial centre, not the user's selected incident location.
const initialPosition = [4.385, 100.978];

function MapUpdater({ position }) {
  const map = useMapEvents({});

  useEffect(() => {
    map.flyTo(position, 15);
  }, [map, position]);

  return null;
}

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      setPosition([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return (
    <>
      <Marker position={position} />
      <Circle
        center={position}
        radius={position.radius || 250}
        pathOptions={{
          color: "#2563eb",
          fillColor: "#3b82f6",
          fillOpacity: 0.15,
        }}
      />
    </>
  );
}

export default function ReportIncident() {
  const [step, setStep] = useState(1);
  const [incidentType, setIncidentType] = useState("");
  const [position, setPosition] = useState(initialPosition);
  const [radius, setRadius] = useState(250);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function nextStep() {
    setError("");

    if (step === 1 && !incidentType) {
      setError("Please select an incident type.");
      return;
    }

    if (step === 2 && !locationLabel.trim()) {
      setError(
        "Please search for a location or select one on the map."
      );
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  }

  function handleMapClick(newPosition) {
    setPosition(newPosition);
    setLocationLabel(
      `${newPosition[0].toFixed(5)}, ${newPosition[1].toFixed(5)}`
    );
  }

  async function handleLocationSearch() {
  setError("");

  const query = locationSearch.trim();

  if (!query) {
    setError("Please enter a location to search.");
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Location search failed.");
    }

    const results = await response.json();

    if (results.length === 0) {
      setError("Location not found. Please try another search.");
      return;
    }

    const result = results[0];

    const newPosition = [
      Number(result.lat),
      Number(result.lon),
    ];

    setPosition(newPosition);
    setLocationLabel(result.display_name);
    setError("");
  } catch (error) {
    console.error("Location search error:", error);

    setError(
      "Unable to search for the location. Please try again."
    );
  }
}

//   function handleLocationSearch(event) {
//     event.preventDefault();
//     setError("");

//     if (!locationSearch.trim()) {
//       setError("Please enter a location to search.");
//       return;
//     }

//     // This is a UI placeholder, not a real geocoding search.
//     // Connect a geocoding service to search actual addresses.
//     setError(
//       "Location search needs a geocoding service. You can select a location directly on the map."
//     );
//   }

  function handlePhotoChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only images up to 5 MB each are allowed.");
    } else {
      setError("");
    }

    setPhotos((current) =>
      [...current, ...validFiles].slice(0, 5)
    );

    event.target.value = "";
  }

  function removePhoto(index) {
    setPhotos((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!incidentDate || !incidentTime || !description.trim()) {
      setError(
        "Please provide the incident date, time, and description."
      );
      return;
    }

    // Frontend demonstration only.
    // Send this payload to your backend API when it is available.
    const report = {
      incidentType,
      location: {
        label: locationLabel,
        latitude: position[0],
        longitude: position[1],
        radiusMeters: radius,
      },
      incidentDate,
      incidentTime,
      description,
      photos: photos.map((photo) => photo.name),
    };

    console.log("Incident report:", report);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="report-page">
        <div className="report-success">
          <div className="success-icon">
            <Check size={36} />
          </div>

          <h2>Report Submitted!</h2>
          <p>
            Your report has been prepared successfully.
            Connect the submission handler to your backend
            to save it permanently.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => window.location.reload()}
          >
            Create Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-container">

        {/* Header */}
        <header className="report-header">
          
          <div>
            <h1>Report an Incident</h1>
            <p>
              Help us keep the community safe.
            </p>
          </div>
        </header>

        {/* Progress indicator */}
        <div className="report-progress">

          {[
            { number: 1, label: "Incident Type" },
            { number: 2, label: "Location" },
            { number: 3, label: "Details" },
          ].map((item, index) => (
            <div
              className="progress-item"
              key={item.number}
            >
              <div className="progress-top">
                <div
                  className={`progress-circle ${
                    step >= item.number ? "completed" : ""
                  }`}
                >
                  {step > item.number ? (
                    <Check size={18} />
                  ) : (
                    item.number
                  )}
                </div>

                {index < 2 && (
                  <div
                    className={`progress-line ${
                      step > item.number ? "completed" : ""
                    }`}
                  />
                )}
              </div>

              <span
                className={
                  step >= item.number
                    ? "progress-label active"
                    : "progress-label"
                }
              >
                {item.label}
              </span>
            </div>
          ))}

        </div>

        <form onSubmit={handleSubmit}>

          {/* STEP 1: INCIDENT TYPE */}
          {step === 1 && (
            <section className="report-card">
              <div className="section-heading">
                <span className="step-caption">
                  STEP 1 OF 3
                </span>

                <h2>Choose Incident Type</h2>

                <p>
                  What type of incident would you like to report?
                </p>
              </div>

              <div className="incident-grid">
                {incidentTypes.map((item) => {
                  const Icon = item.icon;
                  const selected =
                    incidentType === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`incident-option ${
                        selected ? "selected" : ""
                      }`}
                      onClick={() => {
                        setIncidentType(item.id);
                        setError("");
                      }}
                      aria-pressed={selected}
                    >
                      <div className="incident-icon">
                        <Icon size={25} />
                      </div>

                      <span>{item.label}</span>

                      {selected && (
                        <Check
                          className="selected-check"
                          size={18}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <section className="report-card">
              <div className="section-heading">
                <span className="step-caption">
                  STEP 2 OF 3
                </span>

                <h2>Set Incident Location</h2>

                <p>
                  Where did the incident happen?
                </p>
              </div>

              <label
                className="field-label"
                htmlFor="location-search"
              >
                Search location
              </label>

              <div className="location-search">
  <MapPin size={20} />

  <input
    id="location-search"
    type="text"
    placeholder="Enter an address or place"
    value={locationSearch}
    onChange={(event) =>
      setLocationSearch(event.target.value)
    }
    onKeyDown={(event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleLocationSearch();
  }
}}
  />

  <button
    type="button"
    aria-label="Search location"
    onClick={handleLocationSearch}
  >
    <Navigation size={19} />
  </button>
</div>

    

              <div className="map-instructions">
                <MapPin size={16} />
                Tap the map to mark the incident location.
              </div>

              <div className="report-map">
                <MapContainer
                  center={position}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="leaflet-map"
                >
                    <MapUpdater position={position} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <LocationPicker
                    position={position}
                    setPosition={handleMapClick}
                  />
                </MapContainer>
              </div>

              <div className="selected-location">
                <MapPin size={20} />

                <div>
                  <strong>Selected Location</strong>
                  <p>
                    {locationLabel ||
                      "No location selected yet"}
                  </p>
                </div>
              </div>

              <div className="radius-section">
                <label
                  className="field-label"
                  htmlFor="radius"
                >
                  Approximate radius
                </label>

                <p className="field-hint">
                  Choose the approximate area around the incident.
                </p>

                <div className="radius-options">
                  {[100, 250, 500, 1000].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={`radius-option ${
                        radius === value ? "selected" : ""
                      }`}
                      onClick={() => setRadius(value)}
                    >
                      {value >= 1000
                        ? `${value / 1000} km`
                        : `${value} m`}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 3: ADDITIONAL DETAILS */}
          {step === 3 && (
            <section className="report-card">
              <div className="section-heading">
                <span className="step-caption">
                  STEP 3 OF 3
                </span>

                <h2>Additional Details</h2>

                <p>
                  Provide more information about the incident.
                </p>
              </div>

              <div className="form-field">
                <label
                  className="field-label"
                  htmlFor="incident-date"
                >
                  <CalendarDays size={18} />
                  Incident Date
                </label>

                <input
                  id="incident-date"
                  type="date"
                  value={incidentDate}
                  onChange={(event) =>
                    setIncidentDate(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label
                  className="field-label"
                  htmlFor="incident-time"
                >
                  <Clock size={18} />
                  Incident Time
                </label>

                <input
                  id="incident-time"
                  type="time"
                  value={incidentTime}
                  onChange={(event) =>
                    setIncidentTime(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label
                  className="field-label"
                  htmlFor="description"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows={5}
                  placeholder="Describe what happened, including any relevant details..."
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  maxLength={2000}
                  required
                />

                <span className="character-count">
                  {description.length}/2000 characters
                </span>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <Camera size={18} />
                  Add Photos
                </label>

                <label className="upload-area">
                  <Upload size={26} />

                  <strong>
                    Tap to upload photos
                  </strong>

                  <span>
                    JPG, PNG or other image formats · Max 5 MB each
                  </span>

                  <span>
                    Up to 5 photos
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    disabled={photos.length >= 5}
                  />
                </label>

                {photos.length > 0 && (
                  <div className="photo-list">
                    {photos.map((photo, index) => (
                      <div
                        className="photo-item"
                        key={`${photo.name}-${index}`}
                      >
                        <span>{photo.name}</span>

                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          aria-label={`Remove ${photo.name}`}
                        >
                          <X size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="report-summary">
                <h3>Report Summary</h3>

                <p>
                  <strong>Incident:</strong>{" "}
                  {incidentTypes.find(
                    (item) => item.id === incidentType
                  )?.label}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {locationLabel}
                </p>

                <p>
                  <strong>Radius:</strong>{" "}
                  {radius >= 1000
                    ? `${radius / 1000} km`
                    : `${radius} m`}
                </p>
              </div>
            </section>
          )}

          {/* Validation messages */}
          {error && (
            <div className="report-error" role="alert">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="report-actions">

            {step > 1 && (
              <button
                type="button"
                className="secondary-btn"
                onClick={previousStep}
              >
                <ChevronLeft size={19} />
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                className="primary-btn"
                onClick={nextStep}
              >
                Next
                <ChevronRight size={19} />
              </button>
            ) : (
              <button
                type="submit"
                className="primary-btn submit-btn"
              >
                <Check size={19} />
                Submit Report
              </button>
            )}

          </div>

        </form>

        <p className="report-footer">
          Please provide accurate information to help us
          review your report.
        </p>

      </div>
    </div>
  );
}