import { useEffect, useState } from "react";
import translations from "./translations";

import {
  ChevronLeft,
  MapPin,
  Clock,
  Info,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

import "./IncidentDetails.css";

export default function IncidentDetails({
  incident: selectedIncident,
  onBack,
  language = "ENG",

  fetchIncidentDetails,
  incidentTypeLabel,
  incidentStatusLabel,
  formatIncidentTime,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const id = selectedIncident?.id;

  const t = translations[language] || translations.ENG;
  const bm = language === "BM";

  useEffect(() => {
    const controller = new AbortController();

    setDetails(null);
    setError("");

    if (!id) {
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);

    fetchIncidentDetails(id, controller.signal)
      .then((record) => {
        if (!controller.signal.aborted) {
          setDetails(record);
        }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setError(failure.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, retry, fetchIncidentDetails]);

  if (
    loading ||
    error ||
    !details ||
    details.id !== id
  ) {
    return (
      <div className="incident-details-page feed-state-page">
        <button
          type="button"
          className="feed-button"
          onClick={onBack}
        >
          {bm ? "Kembali" : "Back"}
        </button>

        <p
          className={`feed-message ${
            error ? "feed-error" : ""
          }`}
          role={error ? "alert" : "status"}
        >
          {loading
            ? bm
              ? "Memuatkan butiran insiden..."
              : "Loading incident details..."
            : bm
              ? "Butiran insiden tidak tersedia."
              : "Incident details are unavailable."}
        </p>

        {error && (
          <button
            type="button"
            className="feed-button"
            onClick={() =>
              setRetry((value) => value + 1)
            }
          >
            {bm ? "Cuba lagi" : "Try again"}
          </button>
        )}
      </div>
    );
  }

  const isVerified =
    details.verificationStatus === "verified";

  const { latitude, longitude } = details;

  const hasCoordinates =
    latitude !== null &&
    longitude !== null;

  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        longitude - 0.008
      }%2C${latitude - 0.005}%2C${
        longitude + 0.008
      }%2C${latitude + 0.005}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : null;

  const advice =
    t.details.safetyAdvice[details.type] ||
    t.details.safetyAdvice.default ||
    [];

  const sources = details.sources.filter(
    (source) => {
      try {
        return ["https:", "http:"].includes(
          new URL(source.url).protocol
        );
      } catch {
        return false;
      }
    }
  );

  return (
    <div className="incident-details-page">
      <section className="incident-map-section">
        {mapUrl ? (
          <iframe
            className="incident-map-iframe"
            title={
              bm
                ? "Anggaran lokasi insiden"
                : "Approximate incident location"
            }
            src={mapUrl}
            loading="lazy"
          />
        ) : (
          <div className="incident-map-placeholder">
            <MapPin size={28} />
            <span>{t.details.noLocation}</span>
          </div>
        )}

        <button
          type="button"
          className="incident-map-back"
          onClick={onBack}
          aria-label={bm ? "Kembali" : "Back"}
        >
          <ChevronLeft size={23} />
        </button>
      </section>

      <main className="incident-details-content">
        <div className="incident-title-row">
          <div className="incident-alert-icon">
            <AlertCircle
              size={23}
              strokeWidth={2.5}
            />
          </div>

          <div className="incident-title-text">
            <h1>
              {incidentTypeLabel(details, t)}
            </h1>
          </div>

          <span
            className={`incident-status ${
              isVerified
                ? "status-verified"
                : "status-pending"
            }`}
          >
            {incidentStatusLabel(
              details,
              t,
              language
            )}
          </span>
        </div>

        <div className="incident-metadata">
          <div className="incident-meta-row">
            <Clock size={14} />

            <span>
              {formatIncidentTime(details, language)}
            </span>
          </div>

          <div className="incident-meta-row">
            <MapPin size={15} />

            <div className="incident-location-text">
              <span>
                {details.location ||
                  t.details.noLocation}
              </span>

              <span className="incident-approximate">
                ({t.details.approximateLocation})
              </span>
            </div>
          </div>
        </div>

        <div className="incident-description-details">
          <Info size={17} />

          <p>
            {details.description ||
              (bm
                ? "Keterangan tidak tersedia."
                : "Description unavailable.")}
          </p>
        </div>

        <div className="incident-privacy-warning">
          <AlertCircle size={17} />
          <p>{t.details.privacywarning}</p>
        </div>

        {isVerified && sources.length > 0 && (
          <section className="feed-sources">
            <h2>
              {bm
                ? "Sumber pengesahan"
                : "Verification sources"}
            </h2>

            <ul>
              {sources.map((source, index) => (
                <li key={`${source.url}-${index}`}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title ||
                      (bm
                        ? `Sumber ${index + 1}`
                        : `Source ${index + 1}`)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="incident-safety-section">
          <div className="incident-safety-heading">
            <Lightbulb
              size={19}
              fill="#f59e0b"
              color="#f59e0b"
            />

            <h2>
              {t.details.safetyAdviceTitle}
            </h2>
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