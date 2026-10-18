
import { LayoutDashboard, Map, Plus, Bell, User } from 'lucide-react';
import './App.css'
import Dashboard from './Dashboard'
import { useState } from 'react'
import ReportIncident from "./ReportIncident";
import SupportMap from "./SupportMap";
import IncidentDetails from './IncidentDetails'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedIncident, setSelectedIncident] = useState(null)
  // location
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [userLocation, setUserLocation] = useState('')
  const [locationError, setLocationError] = useState('')
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      type: 'Assault',
      latitude: 3.1668,
      longitude: 101.7062,
      time: 'Today, 6:20 PM',
      location: 'Jalan Tun Razak, Kuala Lumpur',
      description: 'Physical assault reported in the area.',
      status: 'Verified'
    },
    {
      id: 2,
      type: 'Robbery',
      latitude: 3.1466,
      longitude: 101.7113,
      time: 'Today, 4:45 PM',
      location: 'Bukit Bintang, Kuala Lumpur',
      description: 'A robbery incident was reported nearby.',
      status: 'Verified'
    },
    {
    id: 3,
    type: 'Assault',
    latitude: 4.3597,
    longitude: 100.9848,
    time: 'Today, 6:20 PM',
    location: 'Bandar Seri Iskandar',
    description: 'Physical assault reported near the commercial area.',
    status: 'Verified'
    },
    {
      id: 4,
      type: 'Robbery',
      latitude: 4.3665,
      longitude: 100.9795,
      time: 'Today, 4:45 PM',
      location: 'Bandar Universiti, Seri Iskandar',
      description: 'A robbery incident was reported near the residential area.',
      status: 'Verified'
    },
    {
      id: 5,
      type: 'Rape',
      latitude: 4.3730,
      longitude: 100.9725,
      time: 'Today, 3:10 PM',
      location: 'Near Universiti Teknologi PETRONAS',
      description: 'Rape activity was reported near the surrounding area.',
      status: 'Pending'
    },
    {
      id: 6,
      type: 'Robbery',
      latitude: 4.3475,
      longitude: 100.9930,
      time: 'Yesterday, 10:30 PM',
      location: 'Seri Iskandar',
      description: 'A personal belonging was reportedly stolen.',
      status: 'Verified'
    },
    {
      id: 7,
      type: 'Rape',
      latitude: 4.3880,
      longitude: 100.9630,
      time: 'Yesterday, 8:15 PM',
      location: 'Tronoh',
      description: 'Residents reported Rape behaviour in the area.',
      status: 'Pending'
    }
  ])

  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setLocationError('Geolocation is not supported on this device.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      setLatitude(lat)
      setLongitude(lng)
      const placeName = await getPlaceName(lat, lng)
      setUserLocation(placeName)
      setLocationError('')

      console.log('Latitude:', lat)
      console.log('Longitude:', lng)
      console.log("Place:", placeName)
    },

    (error) => {
      console.error(error)
      setLocationError('Unable to get your location.')
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
    )
  }
    const getPlaceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )

      const data = await response.json()
      const address = data.address

      const area =
        address.suburb ||
        address.neighbourhood ||
        address.village ||
        address.town ||
        address.city ||
        ''

      const state = address.state || ''

      return `${area}${area && state ? ', ' : ''}${state}`
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      return "Location unavailable"
      }
    }

    return (
         <div className="page">
      <main className="card-container">
        
        <header className="header">
          <div className="logo-row">
            {/* <span className="logo-icon">↗</span> */}
          </div>
          <span className="logo-text">Suara Kita</span>
        </header>

{/* navigation bar */}
<nav className="nav-bar">

  <button
  type="button"
  className={`nav-button ${
    activeTab === 'dashboard' || activeTab === 'IncidentDetails'
      ? 'active'
      : ''
  }`}
  onClick={() => setActiveTab('dashboard')}
>
  <LayoutDashboard size={22} />
  <span>Dashboard</span>
</button>

  <button
    type="button"
    className={`nav-button ${activeTab ==='location' ? 'active' : ''}`}
    onClick={() => setActiveTab('location')}
  >
    <Map size={22} />
    <span>Location</span>
  </button>

  <button
    type="button"
    className={`nav-button ${activeTab === 'Report' ? 'active' : ''}`}
    onClick={() => setActiveTab('Report')}
  >
    <Plus size={22} />
    <span>Report</span>
  </button>

   <button
    type="button"
    className={`nav-button ${activeTab === 'Alerts' ? 'active' : ''}`}
    onClick={() => setActiveTab('Alerts')}
  >
    <Bell size={22} />
    <span>Alerts</span>
  </button>

  <button
    type="button"
    className={`nav-button ${activeTab === 'Profile' ? 'active' : ''}`}
    onClick={() => setActiveTab('Profile')}
  >
    <User size={22} />
    <span>Profile</span>
  </button>

</nav>

{/* DASHBAORD PAGE */}
{activeTab === 'dashboard' && (
  <Dashboard
    getCurrentLocation={getCurrentLocation}
    userLocation={userLocation}
    locationError={locationError}
    incidents={incidents}
    latitude={latitude}
    longitude={longitude}
    onIncidentClick={(incident) => {
      setSelectedIncident(incident)
      setActiveTab('IncidentDetails')
    }}
  />
)}

{activeTab === 'IncidentDetails' && selectedIncident && (
  <IncidentDetails
    incident={selectedIncident}
    onBack={() => setActiveTab('dashboard')}
  />
)}


{/* LOCATION PAGE */}
{activeTab === 'location' && (
  <div className="support-page">
    <div className="support-heading">
      <h1>Nearby Support Services</h1>
      <p>
        Find hospitals, police stations,
        and support organisations near you.
      </p>
    </div>

    <div className="support-map-container">
      <SupportMap 
      latitude={latitude}
      longitude={longitude}
      />
    </div>
  </div>
)}

{activeTab === "Report" && <ReportIncident />}
{/* {activeTab === "Report" && <ReportIncident />}
{activeTab === 'Report' && (
          <div className="report-card">
         
             <h1>Report Incident</h1>
            </div>
             */}

{/* )} */}
        </main>
        </div>
      
    )
}