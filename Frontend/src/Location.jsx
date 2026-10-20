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
  const t = translations[language] || translations.ENG


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

        <button className="location-filter-button">
          <SlidersHorizontal size={18} />
        </button>

      </div>


      {/* MAP */}
      <div className="location-map-wrapper">

        <SupportMap
          latitude={latitude}
          longitude={longitude}
          recenterTrigger={recenterTrigger}
          incidents={incidents}
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