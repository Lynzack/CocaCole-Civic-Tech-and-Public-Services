1. Basic Starter Template

```js

export default function App() {
    return (
         <div className="page">
      <main className="card-container">
        
        <header className="header">
          <div className="logo-row">
            <span className="logo-icon">↗</span>
            <span className="logo-text">Cab Bill Splitter</span>
          </div>

          <nav className="nav-bar">
            <button 
              type="button" 
              className={`nav-button`}
            >
              Split
            </button>

            <button 
              type="button" 
              className={`nav-button`}
            >
              Request
            </button>
          </nav>
        </header>
        </main>
        </div>
    )
}

```

---

2. Template for Tabs

```js

{activeTab === 'calculate' && (
          <div className="card">
            <div className="type-grid">
             <h1>Welcome to Cab Bill Splitter</h1>
            </div>
            </div>

)}

{activeTab === 'request' && (
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





```

---

3. Calculate form ( in card component in calculate tab )

```js

 <div className="hero-section">
              <div className="subtext">Each person owes</div>
              <div className="price-row">
                <span className="currency-symbol">$</span>
                <span className="hero-amount">24.50</span>
              </div>
              <div className="total-pill-row">
                <span className="active-dot"></span>
                Split across 1 pax (total $24.50)
              </div>
            </div>

            {/* Form Inputs */}
            <div className="input-stack">
              {/* Trip Fare */}
              <div className="input-row">
                <span className="label">Trip Fare</span>
                <div className="input-wrapper">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="numeric-input"
                    
                    readOnly
                  />
                </div>
              </div>

              {/* Tolls / ERP */}
              <div className="input-row">
                <span className="label">Tolls / ERP</span>
                <div className="input-wrapper">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="numeric-input"
                    readOnly
                  />
                </div>
              </div>

              {/* Passenger Stepper */}
              <div className="input-row">
                <div>
                  <span className="label">Total Pax</span>
                  <span className="field-hint">Number of riders</span>
                </div>
                <div className="stepper-container">
                  <button
                    type="button"
                    className="stepper-button"
                  >
                    −
                  </button>
                  <span className="stepper-value">0</span>
                  <button
                    type="button"
                    className="stepper-button"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Driver Tip Pills */}
              <div className="tip-section">
                <div className="tip-header">
                  <span className="label">Driver Tip</span>
                  <span className="field-hint">Optional</span>
                </div>
                <div className="tip-grid">
                  {/* <button></button> */}
                  
                </div>
              </div>
            </div>

            {/* Next Action Button */}
            <button
              type="button"
              className="primary-button"
            >
              Review & Request Payment →
            </button>


```

4. Copy paste form ( paste in card component in request tab)


```js

 <pre className="message-box"></pre>

            <div className="action-stack">
              <button
                type="button"
                className="copy-button"
              >
                Copy
              </button>

              <button
                type="button"
                className="back-button"
              >
                Back to Calculator
              </button>
            </div>

```