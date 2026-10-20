import React from "react";
import translations from './translations'
import {
  ChevronLeft,
  MoreHorizontal,
  MapPin,
  Clock,
  Info,
  AlertCircle,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

import "./IncidentDetails.css";

export default function IncidentDetails({
  incident,
  onBack,
  language = "ENG"
}) {
  if (!incident) {
    return (
      <div className="incident-details-page">
        <button
          className="incident-back-button"
          onClick={onBack}
        >
          <ChevronLeft size={22} />
        </button>

        <p className="incident-empty">
          No incident selected.
        </p>
      </div>
    );
  }
  const t = translations[language] || translations.ENG


const translateIncidentType = (type) => {
        const typeMap = {
            Assault: 'assault',
            Robbery: 'robbery',
            Rape: 'rape',
            Murder: 'murder',
            'Sexual Harassment': 'sexualHarassment',
            Other : "other"
        }

        const key = typeMap[type]

        return key ? t.incidentTypes[key] : type
        }

    const translateStatus = (status) => {
        if (status === 'Verified') return t.common.verified
        if (status === 'Pending') return t.common.pending

        return status
    }

    const translateTime = (time) => {
        if (language === 'ENG') return time

        return time
            .replace('Today', t.common.today)
            .replace('Yesterday', t.common.yesterday)
    }

const incidentType = incident.type
  ? translateIncidentType(incident.type)
  : t.dashboard.incidents;

  const incidentTime =
    translateTime(incident.time) || t.details.noTime;

  const incidentLocation =
    incident.location || t.details.noLocation;

  const incidentDescription =
    incident.description ||
    t.details.incidentWarning;

  const isVerified =
  (incident.status || "").toLowerCase() === "verified";

  const latitude = Number(incident.latitude);
  const longitude = Number(incident.longitude);

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        longitude - 0.008
      }%2C${latitude - 0.005}%2C${
        longitude + 0.008
      }%2C${latitude + 0.005}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : null;

  const safetyAdvice = {
    Assault: [
      "Avoid the area if possible.",
      "Stay in well-lit and busy areas.",
      "Report any suspicious activity to authorities.",
    ],

    Robbery: [
      "Avoid displaying valuable belongings.",
      "Stay alert and use well-lit routes.",
      "Report suspicious activity to authorities.",
    ],

    Rape: [
      "Avoid the area if possible.",
      "Travel with trusted companions when possible.",
      "Contact the authorities if you feel unsafe.",
    ],
  };

  const advice =
    safetyAdvice[incidentType] ||
    [
      "Stay alert and remain aware of your surroundings.",
      "Stay in well-lit and busy areas.",
      "Report suspicious activity to authorities.",
    ];

  return (
    <div className="incident-details-page">

      {/* TOP MAP SECTION */}
      <section className="incident-map-section">

        {mapUrl ? (
          <iframe
            className="incident-map-iframe"
            title="Incident location map"
            src={mapUrl}
            loading="lazy"
          />
        ) : (
          <div className="incident-map-placeholder">
            <MapPin size={28} />
            <span>Location unavailable</span>
          </div>
        )}

        {/* Back button */}
        <button
          className="incident-map-back"
          onClick={onBack}
          aria-label="Go back"
        >
          <ChevronLeft size={23} />
        </button>

        {/* More options */}
        <button
          className="incident-map-more"
          aria-label="More options"
          onClick={() =>
            alert("More incident options")
          }
        >
          <MoreHorizontal size={22} />
        </button>

      </section>


      {/* INCIDENT INFORMATION */}
      <main className="incident-details-content">

        {/* Incident heading */}
        <div className="incident-title-row">

          <div className="incident-alert-icon">
            <AlertCircle size={23} strokeWidth={2.5} />
          </div>

          <div className="incident-title-text">
            <h1>{t.incidentTypes[incidentType] || incidentType}</h1>
          </div>

          <span
            className={`incident-status ${
              isVerified
                ? "status-verified"
                : "status-pending"
            }`}
          >
            {translateStatus(incident.status)}
          </span>

        </div>


        {/* Date and time */}
        <div className="incident-metadata">

          <div className="incident-meta-row">
            <Clock size={14} />

            <span>{incidentTime}</span>
          </div>

          {/* Location */}
          <div className="incident-meta-row">
            <MapPin size={15} />

            <div className="incident-location-text">
              <span>{incidentLocation}</span>
              <span className="incident-approximate">
                ({t.details.approximateLocation})
              </span>
            </div>
          </div>

        </div>


        {/* Description */}
        <div className = "incident-description-details">
          <Info size={17} />

          <p>{incidentDescription}  
          </p>
        </div>
        
  


        {/* Privacy warning */}
        <div className="incident-privacy-warning">

          <AlertCircle size={17} />

          <p>
            {t.details.privacywarning}
          </p>

        </div>


        {/* Safety advice */}
        <section className="incident-safety-section">

          <div className="incident-safety-heading">

            <Lightbulb
              size={19}
              fill="#f59e0b"
              color="#f59e0b"
            />

            <h2>Safety Advice</h2>

          </div>

          <ul className="incident-safety-list">
            {advice.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </section>

      </main>

    </div>
  );
}