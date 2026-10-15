
import './App.css'
import { useState } from 'react'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
   

    return (
         <div className="page">
      <main className="card-container">
        
        <header className="header">
          <div className="logo-row">
            <span className="logo-icon">↗</span>
            <span className="logo-text">Suara Kita</span>
          </div>

          <nav className="nav-bar">
            <button 
              type="button" 
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>

            <button 
              type="button" 
              className={`nav-button ${activeTab === 'Call Recordings' ? 'active' : ''}`}
              onClick={() => setActiveTab('Call Recordings')}
            >
              Call Recordings
            </button>

            <button 
              type="button" 
              className={`nav-button ${activeTab === 'Complaints Management' ? 'active' : ''}`}
              onClick={() => setActiveTab('Complaints Management')}
            >
              Complaints Management
            </button>

            <button 
              type="button" 
              className={`nav-button ${activeTab === 'Potential Duplicates' ? 'active' : ''}`}
              onClick={() => setActiveTab('Potential Duplicates')}
            >
              Potential Duplicates
            </button>

          </nav>
        </header>


        {activeTab === 'dashboard' && (
          <div className="card">
            <div className="type-grid">
             <h1>Welcome to Cab Bill Splitter</h1>
            </div>
            </div>

)}

        {activeTab === 'Call Recordings' && (
            <div className="card">
                    <div className="request-header">
                      <div className="check-circle">✓</div>
                      <h2 className="request-title text-black">Payment Request Ready</h2>
                      <p className="field-hint">
                        Generated for 1 pax · Grab 4 Seater
                      </p>
                    </div>
            </div>
        )}
        </main>
        </div>
      
    )
}