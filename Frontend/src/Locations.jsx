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
  const [searchText, setSearchText] = useState("")
  const [searchedPosition, setSearchedPosition] = useState(null)

  const incidentTypeOptions = [
    { id: "Assault", label: t.incidentTypes.assault },
    { id: "Robbery", label: t.incidentTypes.robbery },
    { id: "Rape", label: t.incidentTypes.rape },
    { id: "Murder", label: t.incidentTypes.murder },
    {
      id: "Sexual Harassment",
      label: t.incidentTypes.sexualHarassment
    }
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

  const handleLocationSearch = async () => {
    const query = searchText.trim()

    if (!query) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
      )

      const results = await response.json()

      if (results.length === 0) {
        alert(
          language === "BM"
            ? "Lokasi tidak dijumpai."
            : "Location not found."
        )
        return
      }

      const result = results[0]

      setSearchedPosition([
        Number(result.lat),
        Number(result.lon)
      ])

      setRecenterTrigger((prev) => prev + 1)

    } catch (error) {
      console.error("Location search failed:", error)

      alert(
        language === "BM"
          ? "Carian lokasi gagal."
          : "Location search failed."
      )
    }
  }

  return (
    <div className="location-page">

      {/* SEARCH BAR */}
      <div className="location-search-row">

        <div className="location-search-box">
            <button
              type="button"
              className="location-search-icon-button"
              onClick={handleLocationSearch}
            >
              <Search size={16} />
            </button>

          <input
            type="text"
            placeholder={t.locationPage.searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLocationSearch()
              }
            }}
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
                key={type.id}
                type="button"
                className={`filter-option ${
                  selectedTypes.includes(type.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  toggleIncidentType(type.id)
                }
              >
                {type.label}
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
          searchedPosition={searchedPosition}
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