import { useState, useEffect } from "react";
import translations from "./translations";

import {
  Hand,
  Wallet,
  Skull,
  AlertTriangle,
  ShieldAlert,
  UserRoundX,
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

const incidentTypes = [
  { id: "assault", label: "Assault", icon: Hand },
  { id: "robbery", label: "Robbery", icon: Wallet },
  { id: "rape", label: "Rape", icon: ShieldAlert },
  { id: "murder", label: "Murder", icon: Skull },
  { id: "sexualHarassment", label: "Sexual Harassment", icon: UserRoundX },
];

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

export default function ReportIncident({ language = "ENG" }) {
  const t = translations[language] || translations.ENG;

  const [step, setStep] = useState(1);
  const [incidentType, setIncidentType] = useState("");
  const [position, setPosition] = useState(initialPosition);
  const [radius, setRadius] = useState(250);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function nextStep() {
    setError("");

    if (step === 1 && !incidentType) {
      setError(t.report.errors.selectIncident);
      return;
    }

    if (step === 2 && !locationLabel.trim()) {
      setError(t.report.errors.selectLocation);
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
      setError(t.report.errors.enterLocation);
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
        setError(t.report.errors.locationNotFound);
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
        t.report.errors.searchError
      );
    }
  }

  function handlePhotoChange(event) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      setError(t.report.errors.photoSize);
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
        t.report.errors.requiredDetails
      );

      return;
    }
    if (photos.length === 0) {
      setError("photoRequired");
      return;
    }

    const report = {
      incidentType,

      location: {
        label: locationLabel,
        details: locationDetails,
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

          <h2>{t.report.successTitle}</h2>

          <p>
            {t.report.successMessage}
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => window.location.reload()}
          >
            {t.report.createAnother}
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="report-page">

      <div className="report-container">

        <header className="report-header">

          <div>
            <h1>{t.report.title}</h1>
            <p>{t.report.subtitle}</p>
          </div>

        </header>

        <div className="report-progress">

          {t.report.steps.map((label, index) => {
            const number = index + 1;

            return (
              <div
                className="progress-item"
                key={number}
              >

                <div className="progress-top">

                  <div
                    className={`progress-circle ${
                      step >= number ? "completed" : ""
                    }`}
                  >
                    {step > number ? (
                      <Check size={18} />
                    ) : (
                      number
                    )}
                  </div>

                  {index < 2 && (
                    <div
                      className={`progress-line ${
                        step > number ? "completed" : ""
                      }`}
                    />
                  )}

                </div>

                <span
                  className={
                    step >= number
                      ? "progress-label active"
                      : "progress-label"
                  }
                >
                  {label}
                </span>

              </div>
            );
          })}

        </div>

        <form onSubmit={handleSubmit}>

          {step === 1 && (
            <section className="report-card">

              <div className="section-heading">

                <span className="step-caption">
                  {t.report.step} 1 {t.report.of} 3
                </span>

                <h2>{t.report.chooseIncident}</h2>

                <p>
                  {t.report.incidentQuestion}
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

                      <span>
                        {t.incidentTypes[item.id]}
                      </span>

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

          {step === 2 && (
            <section className="report-card">

              <div className="section-heading">

                <span className="step-caption">
                  {t.report.step} 2 {t.report.of} 3
                </span>

                <h2>
                  {t.report.locationTitle}
                </h2>

                <p>
                  {t.report.locationQuestion}
                </p>

              </div>

              <label
                className="field-label"
                htmlFor="location-search"
              >
                {t.report.searchLocation}
              </label>

              <div className="location-search">

                <MapPin size={20} />

                <input
                  id="location-search"
                  type="text"
                  placeholder={
                    t.report.locationPlaceholder
                  }
                  value={locationSearch}
                  onChange={(event) =>
                    setLocationSearch(
                      event.target.value
                    )
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
                  aria-label={
                    t.report.searchLocation
                  }
                  onClick={handleLocationSearch}
                >
                  <Navigation size={19} />
                </button>

              </div>

              <div className="map-instructions">

                <MapPin size={16} />

                {t.report.mapInstruction}

              </div>

              <div className="report-map">

                <MapContainer
                  center={position}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="leaflet-map"
                >

                  <MapUpdater
                    position={position}
                  />

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

                  <strong>
                    {t.report.selectedLocation}
                  </strong>

                  <p>
                    {locationLabel ||
                      t.report.noLocation}
                  </p>

                </div>

              </div>

              <div className="form-field">
                <label
                  className="field-label"
                  htmlFor="location-details"
                >
                  {t.report.locationDetails}
                </label>

                <input
                  id="location-details"
                  type="text"
                  placeholder={t.report.locationDetailsPlaceholder}
                  value={locationDetails}
                  onChange={(event) =>
                    setLocationDetails(event.target.value)
                  }
                />
              </div>

              <div className="radius-section">

                <label
                  className="field-label"
                  htmlFor="radius"
                >
                  {t.report.radius}
                </label>

                <p className="field-hint">
                  {t.report.radiusHint}
                </p>

                <div className="radius-options">

                  {[100, 250, 500, 1000].map(
                    (value) => (

                      <button
                        type="button"
                        key={value}
                        className={`radius-option ${
                          radius === value
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setRadius(value)
                        }
                      >

                        {value >= 1000
                          ? `${value / 1000} km`
                          : `${value} m`
                        }

                      </button>

                    )
                  )}

                </div>

              </div>

            </section>
          )}

          {step === 3 && (
            <section className="report-card">

              <div className="section-heading">

                <span className="step-caption">
                  {t.report.step} 3 {t.report.of} 3
                </span>

                <h2>
                  {t.report.detailsTitle}
                </h2>

                <p>
                  {t.report.detailsQuestion}
                </p>

              </div>

              <div className="form-field">

                <label
                  className="field-label"
                  htmlFor="incident-date"
                >
                  <CalendarDays size={18} />

                  {t.report.incidentDate}
                </label>

                <input
                  id="incident-date"
                  type="date"
                  value={incidentDate}
                  onChange={(event) =>
                    setIncidentDate(
                      event.target.value
                    )
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

                  {t.report.incidentTime}
                </label>

                <input
                  id="incident-time"
                  type="time"
                  value={incidentTime}
                  onChange={(event) =>
                    setIncidentTime(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="form-field">

                <label
                  className="field-label"
                  htmlFor="description"
                >
                  {t.report.description}
                </label>

                <textarea
                  id="description"
                  rows={5}
                  placeholder={
                    t.report.descriptionPlaceholder
                  }
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
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

                  {t.report.addPhotos}

                </label>

                <label className="upload-area">

                  <Upload size={26} />

                    <strong>
                      {t.report.uploadPhotos}
                    </strong>

                    <span>
                      {t.report.photoFormats}
                    </span>

                    <span>
                      {t.report.photoLimit}
                    </span>

                    <label className="custom-file-upload">

                      <input
                        className="hidden-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        disabled={photos.length >= 5}
                      />

                    </label>

                </label>

                {photos.length > 0 && (
                  <div className="photo-list">

                    {photos.map(
                      (photo, index) => (

                        <div
                          className="photo-item"
                          key={`${photo.name}-${index}`}
                        >

                          <span>
                            {photo.name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removePhoto(index)
                            }
                            aria-label={`${t.report.removePhoto} ${photo.name}`}
                          >
                            <X size={17} />
                          </button>

                        </div>

                      )
                    )}

                  </div>
                )}

              </div>

              <div className="report-summary">

                <h3>
                  {t.report.summary}
                </h3>

                <p>
                  <strong>
                    {t.report.incident}:
                  </strong>{" "}

                  {t.incidentTypes[incidentType]}
                </p>

                <p>
                  <strong>
                    {t.common.location}:
                  </strong>{" "}

                  {locationLabel}
                </p>

                <p>
                  <strong>
                    {t.report.radius}:
                  </strong>{" "}

                  {radius >= 1000
                    ? `${radius / 1000} km`
                    : `${radius} m`
                  }
                </p>

              </div>

            </section>
          )}

          {error && (
            <div
              className="report-error"
              role="alert"
            >

              <AlertTriangle size={18} />

              <span>
                {error === "photoRequired"
                  ? t.report.errors.photoRequired
                  : error}
              </span>

            </div>
          )}

          <div className="report-actions">

            {step > 1 && (
              <button
                type="button"
                className="secondary-btn"
                onClick={previousStep}
              >

                <ChevronLeft size={19} />

                {t.common.back}

              </button>
            )}

            {step < 3 ? (

              <button
                type="button"
                className="primary-btn"
                onClick={nextStep}
              >

                {t.common.next}

                <ChevronRight size={19} />

              </button>

            ) : (

              <button
                type="submit"
                className="primary-btn submit-btn"
              >

                <Check size={19} />

                {t.report.submit}

              </button>

            )}

          </div>

        </form>

        <p className="report-footer">
          {t.report.footer}
        </p>

      </div>

    </div>
  );
}