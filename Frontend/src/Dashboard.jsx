import "./Dashboard.css";
import translations from "./translations";
import { MapPin } from "lucide-react";

export default function Dashboard({
  getCurrentLocation,
  userLocation,
  locationError,
  incidents = [],
  latitude,
  longitude,
  language = "ENG",
  onIncidentClick,

  selectedFilter = "",
  onFilterChange,
  loading,
  feedError,
  hasMore,
  onLoadMore,
  onRefresh,

  incidentTypes,
  incidentTypeLabel,
  incidentStatusLabel,
  formatIncidentTime,
  distanceKm,
}) {
  const t = translations[language] || translations.ENG;
  const bm = language === "BM";

  return (
    <div className="dash-container">
      <div
        className="selected-location-card"
        role="button"
        tabIndex={0}
        onClick={getCurrentLocation}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            getCurrentLocation();
          }
        }}
      >
        <MapPin
          size={25}
          className="selected-location-icon"
        />

        <div className="selected-location-text">
          <h3>{t.dashboard.selectedLocation}</h3>
          <p>
            {userLocation || t.dashboard.getLocation}
          </p>
        </div>
      </div>

      {locationError && (
        <p className="location-error" role="alert">
          {locationError}
        </p>
      )}

      <div className="dash-header">
        <h2>{t.dashboard.incidents}</h2>
      </div>

      <div
        className="incident-filters"
        aria-label={
          bm ? "Jenis insiden" : "Incident type"
        }
      >
        {[
          { value: "", key: "all" },
          ...incidentTypes,
        ].map((type) => (
          <button
            key={type.key}
            type="button"
            className={`filter-chip ${
              selectedFilter === type.value
                ? "active"
                : ""
            }`}
            aria-pressed={
              selectedFilter === type.value
            }
            onClick={() =>
              onFilterChange(type.value)
            }
          >
            {type.value
              ? t.incidentTypes[type.key]
              : t.dashboard.all}
          </button>
        ))}
      </div>

      <div className="feed-controls">
        <button
          type="button"
          className="feed-button"
          disabled={loading}
          onClick={onRefresh}
        >
          {bm ? "Muat semula" : "Refresh"}
        </button>
      </div>

      {feedError && (
        <div
          className="feed-message feed-error"
          role="alert"
        >
          <p>
            {bm
              ? "Insiden tidak dapat dimuatkan. Sila cuba lagi."
              : "Incidents could not be loaded. Please try again."}
          </p>

          <button
            type="button"
            className="feed-button"
            disabled={loading}
            onClick={onRefresh}
          >
            {bm ? "Cuba lagi" : "Try again"}
          </button>
        </div>
      )}

      {loading && (
        <p className="feed-message" role="status">
          {bm
            ? "Memuatkan insiden..."
            : "Loading incidents..."}
        </p>
      )}

      {!loading &&
        !feedError &&
        incidents.length === 0 && (
          <p className="feed-message">
            {bm
              ? "Tiada insiden diterbitkan untuk pilihan ini."
              : "No published incidents for this selection."}
          </p>
        )}

      <div
        className="incident-list"
        aria-busy={loading}
      >
        {incidents.map((incident) => {
          const distance = distanceKm(
            latitude,
            longitude,
            incident
          );

          return (
            <div
              className="incident-card"
              key={incident.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                onIncidentClick(incident)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  onIncidentClick(incident);
                }
              }}
            >
              <div className="incident-top-row">
                <div className="incident-main-row">
                  <div
                    className="incident-icon assault"
                    aria-hidden="true"
                  >
                    !
                  </div>

                  <div className="incident-heading-text">
                    <h3>
                      {incidentTypeLabel(incident, t)}
                    </h3>

                    <p className="incident-meta">
                      {distance === null
                        ? t.dashboard.distanceUnavailable
                        : `~ ${distance.toFixed(1)} km`}
                      {" • "}
                      {formatIncidentTime(
                        incident,
                        language
                      )}
                    </p>
                  </div>
                </div>

                <span
                  className={`incident-badge ${
                    incident.verificationStatus ===
                    "unverified"
                      ? "feed-unverified"
                      : ""
                  }`}
                >
                  {incidentStatusLabel(
                    incident,
                    t,
                    language
                  )}
                </span>
              </div>

              <div className="incident-bottom-content">
                <div className="incident-location">
                  <MapPin size={15} />

                  <span>
                    {incident.location ||
                      t.details.noLocation}
                  </span>
                </div>

                <p className="incident-description feed-card-description">
                  {incident.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && !feedError && (
        <div className="feed-controls">
          <button
            type="button"
            className="feed-button"
            disabled={loading}
            onClick={onLoadMore}
          >
            {bm
              ? "Muat lebih banyak"
              : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}