import { useState } from 'react'
import './Dashboard.css';
import translations from './translations'
import { MapPin } from 'lucide-react'

export default function Dashboard({
  getCurrentLocation,
  userLocation,
  locationError,
  incidents,
  latitude,
  longitude,
  language,
  onIncidentClick
}) {
    const [selectedFilter, setSelectedFilter] = useState('All')
    const t = translations[language] || translations.ENG
    const translateIncidentType = (type) => {
        const typeMap = {
            Assault: 'assault',
            Robbery: 'robbery',
            Rape: 'rape',
            Murder: 'murder',
            'Sexual Harassment': 'sexualHarassment'
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

    // 1. Calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const userLat = Number(lat1)
    const userLon = Number(lon1)
    const incidentLat = Number(lat2)
    const incidentLon = Number(lon2)

    if (
        !Number.isFinite(userLat) ||
        !Number.isFinite(userLon) ||
        !Number.isFinite(incidentLat) ||
        !Number.isFinite(incidentLon)
    ) {
        return null
    }

    const R = 6371
    const dLat = (incidentLat - userLat) * Math.PI / 180
    const dLon = (incidentLon - userLon) * Math.PI / 180

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(userLat * Math.PI / 180) *
        Math.cos(incidentLat * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    )
    return R * c
    }


    // 2. Add distance to incidents
    const incidentsWithDistance = incidents.map((incident) => {
    let calculatedDistance = null
    if (
        latitude !== null &&
        longitude !== null &&
        incident.latitude !== undefined &&
        incident.longitude !== undefined
    ) {
        calculatedDistance = calculateDistance(
        latitude,
        longitude,
        incident.latitude,
        incident.longitude
        )
    }

    return {
        ...incident,
        calculatedDistance
    }
    })


    // 3. Filter incidents
    const filteredIncidents =
    selectedFilter === 'All'
        ? incidentsWithDistance
        : incidentsWithDistance.filter(
            (incident) => incident.type === selectedFilter
        )
    const sortedIncidents =
    latitude !== null && longitude !== null
        ? [...filteredIncidents].sort((a, b) => {
            if (a.calculatedDistance === null) return 1
            if (b.calculatedDistance === null) return -1

            return a.calculatedDistance - b.calculatedDistance
        })
        : filteredIncidents



    return (
        <div className="dash-container">

            {/* get location */}
            <div
            className="selected-location-card"
            onClick={getCurrentLocation}
            >
            <MapPin size={25} className="selected-location-icon" />

            <div className="selected-location-text">
                <h3>{t.dashboard.selectedLocation}</h3>
                <p>{userLocation || t.dashboard.getLocation}</p>
            </div>

            </div>

            {locationError && (
            <p className="location-error">
                {locationError}
            </p>
            )}

            {/* // INCIDENTS Header */}
            <div className="dash-header">
            <h2>{t.dashboard.incidents}</h2>
            </div>

            {/* INCIDENTS FILTER */}
            <div className="incident-filters">

            <button
                className={`filter-chip ${
                selectedFilter === 'All' ? 'active' : ''
                }`}
                onClick={() => setSelectedFilter('All')}
            >
                {t.dashboard.all}
            </button>

            <button
                className={`filter-chip ${
                selectedFilter === 'Assault' ? 'active' : ''
                }`}
                onClick={() => setSelectedFilter('Assault')}
            >
                {t.incidentTypes.assault}
            </button>

            <button
                className={`filter-chip ${
                selectedFilter === 'Robbery' ? 'active' : ''
                }`}
                onClick={() => setSelectedFilter('Robbery')}
            >
                {t.incidentTypes.robbery}
            </button>

            <button
                className={`filter-chip ${
                selectedFilter === 'Rape' ? 'active' : ''
                }`}
                onClick={() => setSelectedFilter('Rape')}
            >
                {t.incidentTypes.rape}
            </button>

            <button
                className={`filter-chip ${
                selectedFilter === 'Murder' ? 'active' : ''
                }`}
                onClick={() => setSelectedFilter('Murder')}
            >
                {t.incidentTypes.murder}
            </button>

            <button
                className={`filter-chip ${
                selectedFilter === 'Sexual Harassment' ? 'active' : ''
                }`}
                onClick={() => setSelectedFilter('Sexual Harassment')}
            >
                {t.incidentTypes.sexualHarassment}
            </button>

            </div>

            {/* INCIDENT CARD */}
        <div className="incident-list">
             {sortedIncidents.map((incident) => (
        <div
            className="incident-card"
            key={incident.id}
            onClick={() => onIncidentClick(incident)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onIncidentClick(incident);
                }
            }}
        >
                        <div className="incident-top-row">
                            <div className="incident-main-row">

                                <div className="incident-icon assault">
                                    !
                                </div>

                                <div className="incident-heading-text">
                                    <h3>{translateIncidentType(incident.type)}</h3>
                                    <p className="incident-meta">
                                        {Number.isFinite(incident.calculatedDistance)
                                            ? `~ ${incident.calculatedDistance.toFixed(1)} km`
                                            : t.dashboard.distanceUnavailable
                                        }
                                        {' • '}
                                        {translateTime(incident.time)}
                                    </p>
                                </div>
                            </div>

                            <span className="incident-badge">
                            {translateStatus(incident.status)}
                            </span>

                        </div>

                        <div className="incident-bottom-content">

                            <div className="incident-location">
                            <MapPin size={15} />
                            <span>{incident.location}</span>
                            </div>

                            <p className="incident-description">
                            {incident.description}
                            </p>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
} 