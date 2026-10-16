
import { LayoutDashboard, Map, Plus, Bell, User } from 'lucide-react';
import './App.css'
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import SupportMap from "./SupportMap";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  /* replace with the actual data*/
  const CaseData = [
  { month: 'May', case: 120 },
  { month: 'Jun', case: 180 },
  { month: 'Jul', case: 90 },
  { month: 'Aug', case: 220 },
  { month: 'Sep', case: 150 },
  { month: 'Oct', case: 200 }
];
   

    return (
         <div className="page">
      <main className="card-container">
        
        <header className="header">
          <div className="logo-row">
            <span className="logo-icon">↗</span>
            <span className="logo-text">Suara Kita</span>
          </div>

{/* navigation bar */}
<nav className="nav-bar">

  <button
    type="button"
    className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
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
```

        </header>


    
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
      <SupportMap />
    </div>
  </div>
)}
        </main>
        </div>
      
    )
}