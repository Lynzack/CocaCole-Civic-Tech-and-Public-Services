import './Location.css'
import translations from './translations'
import { Search, SlidersHorizontal, LocateFixed } from 'lucide-react'
import SupportMap from './SupportMap'
import { useState } from 'react'

export default function Location({
  latitude,
  longitude,
  getCurrentLocation,
  incidents,
  language
}) {
  const [recenterTrigger, setRecenterTrigger] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState([])
  const t = translations[language] || translations.ENG

  const incidentTypeOptions = [
  "Assault",
  "Robbery",
  "Rape",
  "Murder",
  "Sexual Harassment"
]

  const filteredIncidents =
    selectedTypes.length === 0
      ? incidents
      : incidents.filter((incident) =>
          selectedTypes.includes(incident.type)
        )

  const toggleIncidentType = (type) => {
    setSelectedTypes((currentTypes) =>
      currentTypes.includes(type)
        ? currentTypes.filter((item) => item !== type)
        : [...currentTypes, type]
    )
  }


  return (
    <div className="location-page">

      {/* SEARCH BAR */}
      <div className="location-search-row">

        <div className="location-search-box">
          <Search size={16} />

          <input
            type="text"
            placeholder={t.locationPage.searchPlaceholder}
          />
        </div>

        <button
          type="button"
          className={`location-filter-button ${
            selectedTypes.length > 0 ? "active" : ""
          }`}
          onClick={() =>
            setShowFilters((current) => !current)
          }
        >
          <SlidersHorizontal size={18} />
        </button>

      </div>
      
      {showFilters && (
        <div className="location-filter-panel">

          <div className="filter-panel-header">
            <strong>
              {language === "BM"
                ? "Tapis Jenis Insiden"
                : "Filter Incident Types"}
            </strong>

            <button
              type="button"
              onClick={() => setSelectedTypes([])}
            >
              {language === "BM"
                ? "Kosongkan"
                : "Clear"}
            </button>
          </div>

          <div className="filter-options">
            {incidentTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-option ${
                  selectedTypes.includes(type)
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  toggleIncidentType(type)
                }
              >
                {type}
              </button>
            ))}
          </div>

        </div>
      )}

      {/* MAP */}
      <div className="location-map-wrapper">

        <SupportMap
          latitude={latitude}
          longitude={longitude}
          recenterTrigger={recenterTrigger}
          incidents={filteredIncidents}
          language={language}
        />

        {/* CURRENT LOCATION BUTTON */}
        <button
          className="map-floating-button current"
          onClick={() => {
            if (latitude !== null && longitude !== null) {
              setRecenterTrigger(prev => prev + 1)
            } else {
              getCurrentLocation()
            }
          }}
        >
          <LocateFixed size={19} />
        </button>

      </div>

    </div>
  )
}