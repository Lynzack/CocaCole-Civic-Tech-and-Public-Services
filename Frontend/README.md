# 🚖 Cab Bill Splitter — React Workshop

Welcome to the **Cab Bill Splitter** hands-on workshop! In this session, you will build a mobile-first bill splitting application inspired by ride-hailing services like Grab. 

Along the way, you'll learn foundational React concepts—state management, hooks, event handling, derived state, and interacting with browser APIs—while also exploring modern **AI-assisted engineering workflows** using specialized Agent Skills, and **deploying your live application to the web using GitHub and Vercel**.

---

## 🎯 Workshop Objectives

By the end of this workshop, you will understand and apply:

- **JSX & Component Structure**: Breaking down UI into clean, readable markup.
- **State Management with `useState`**: Handling interactive form inputs (fare, ERP tolls, tip, rider count, ride tier).
- **Derived State & Computations**: Calculating per-pax shares, subtotals, and formatted receipt summaries without unnecessary re-renders or redundant state.
- **Side-Effects & DOM Refs (`useEffect`, `useRef`)**: Automatically focusing inputs on mount and handling lifecycle events.
- **Browser APIs**: Copying formatted payment request text to the clipboard via `navigator.clipboard`.
- **UI State & User Feedback**: Managing loading, success, and disabled button states.
- **AI Agent-Assisted Development**: Leveraging project-level AI Agent Skills (`.agents/`) for isolated UI design integration, static blast-radius analysis, and pre-commit security audits.
- **Version Control & Cloud Deployment**: Publishing your project to a GitHub repository and setting up automated CI/CD deployments on **Vercel** with a public, shareable URL.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- A code editor like [VS Code](https://code.visualstudio.com/) or [Antigravity IDE](https://antigravity.dev/)
- A free [GitHub Account](https://github.com/)
- A free [Vercel Account](https://vercel.com/signup) (sign in with your GitHub account)
- A modern web browser (Chrome, Safari, Firefox, Edge)

### Setup Instructions

1. **Clone or navigate to the project directory:**
   ```bash
   cd grab-bill-splitter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Open the local URL displayed in your terminal (usually `http://localhost:5173`).

---

## 📂 Project Structure

```text
grab-bill-splitter/
├── .agents/
│   └── skills/
│       ├── frontend-design-integration/     # 🎨 AI skill: Additive UI component creation & link ingestion
│       ├── targeted-blast-radius-analysis/  # 🔍 AI skill: Static dependency & regression risk audit
│       └── git-precommit-audit-pr-generator/# 🛡️ AI skill: Secret scanning & PR commit message generator
├── reference_code/
│   ├── SampleCode.jsx                       # ✨ Complete reference solution with explanatory notes
│   └── TEMPLATES.md                         # 📋 Progressive code snippets for workshop milestones
├── public/
│   ├── favicon.svg                          # App favicon
│   └── icons.svg                            # Vector icons
├── src/
│   ├── App.jsx                              # 🛠️ Main workshop file (your primary workspace!)
│   ├── App.css                              # Styled CSS mobile card components & design tokens
│   ├── index.css                            # Global typography & base styling
│   └── main.jsx                             # React root entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🤖 AI Agent Skills (`.agents/`)

This repository is pre-configured with **AI Agent Skills** in [`.agents/skills/`](.agents/skills/). In modern AI-augmented coding, skills act as specialized playbooks that guide the AI pair programmer to follow strict architectural boundaries, security checks, and code generation standards.

| Skill | Path | Primary Purpose |
|---|---|---|
| **Frontend Design Integration** | [`.agents/skills/frontend-design-integration`](.agents/skills/frontend-design-integration/SKILL.md) | Converts external wireframes/links into modular, additive components under `src/components/new-ui/` without breaking existing code. |
| **Targeted Blast Radius Analysis** | [`.agents/skills/targeted-blast-radius-analysis`](.agents/skills/targeted-blast-radius-analysis/SKILL.md) | Traces symbols and dependencies before/after code changes to ensure modifications don't cause regressions. |
| **Git Pre-Commit Audit & PR Generator** | [`.agents/skills/git-precommit-audit-pr-generator`](.agents/skills/git-precommit-audit-pr-generator/SKILL.md) | Scans staged git diffs for accidental API keys or secrets and formats standard Conventional Commits and PR messages. |

### How to Use Agent Skills in the Workshop

When pair programming with your AI assistant (e.g., in Antigravity or chat):

1. **Test isolated UI generation:**
   > *"Using the `frontend-design-integration` skill, create a tip calculation summary card under `src/components/new-ui/` without modifying `App.jsx`."*
2. **Perform regression analysis before refactoring:**
   > *"Run a targeted blast radius analysis on `src/App.jsx` before we split state into custom hooks."*
3. **Audit your code before committing:**
   > *"Run the `git-precommit-audit-pr-generator` skill on my staged files to check for accidental secrets and create my workshop commit message."*

---

## 🗺️ Workshop Roadmap & Milestones

The workshop is divided into 5 progressive steps. You can follow along and use the snippets in [`reference_code/TEMPLATES.md`](reference_code/TEMPLATES.md).

### Milestone 1: The App Shell & Header
- Inspect [`src/App.jsx`](src/App.jsx) and the provided styles in [`src/App.css`](src/App.css).
- Render the base card container, app logo, and the top navigation bar (`Split` and `Request` buttons).

### Milestone 2: Tab Navigation & Conditional Rendering
- Introduce a state variable for `activeTab` (`'calculate'` vs `'request'`).
- Conditionally render either the calculation card or the payment request card.
- Apply active styling to the nav buttons depending on the current tab.

### Milestone 3: Inputs, Sliders & Reactive Calculations
- Add state hooks for:
  - `fare` (Base trip fare)
  - `tolls` (ERP / Toll fees)
  - `tip` (Driver tip selection)
  - `riders` (Number of passengers)
  - `rideType` (Grab Meter, 4-Seater, 6-Seater, Premium)
- Calculate **derived values** dynamically:
  ```js
  const baseFare = parseFloat(fare) || 0
  const tollFee = parseFloat(tolls) || 0
  const total = baseFare + tollFee + tip
  const sharePerPerson = riders > 0 ? total / riders : 0
  ```
- Wire up the passenger stepper (`+` / `-`) and quick-select tip pills (`None`, `+$2`, `+$3`, `+$5`).

### Milestone 4: Share Message & Clipboard Integration
- Format a shareable breakdown message string (ideal for WhatsApp / Telegram / SMS).
- Implement the `handleCopy` function using `navigator.clipboard.writeText()`.
- Display real-time UI feedback (`Copying...` -> `Copied!` -> `Copy to Clipboard`).

### Milestone 5: GitHub Setup & Live Vercel Deployment
- Initialize your Git repository and verify your build passes (`npm run build`).
- Push your code to a new personal GitHub repository.
- Link your GitHub repository to Vercel for instant, zero-config production deployment.

---

## 🌐 GitHub Setup & Vercel Deployment Guide

Deploying your bill splitter allows you and your friends to open the app on actual mobile devices and split taxi bills in real life!

### Step 1: Initialize Git and Push to GitHub

1. **Verify your production build succeeds locally:**
   ```bash
   npm run build
   ```
   *(Ensure there are no compilation or syntax errors)*

2. **Check git status and stage your changes:**
   ```bash
   git status
   git add .
   ```

   > [!TIP]
   > You can ask your AI assistant: *"Run the `git-precommit-audit-pr-generator` skill to audit my staged files"* to ensure no secret tokens or unwanted files are being committed!

3. **Commit your project:**
   ```bash
   git commit -m "feat: complete cab bill splitter app with react and vite"
   ```

4. **Rename default branch to `main` (if not already):**
   ```bash
   git branch -M main
   ```

5. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new).
   - Enter Repository name: `grab-bill-splitter`.
   - Choose **Public** (recommended so Vercel can access it on free tier).
   - **Do not** initialize with README, .gitignore, or license (we already have them).
   - Click **Create repository**.

6. **Link your local repository and push:**
   ```bash
   git remote add origin https://github.com/nidqija/UTP-Frontend-Deployment-Workshop.git
   git push -u origin main
   ```

---

### Step 2: Deploy to Vercel

Vercel provides native, optimized hosting for Vite and React applications with free SSL and global CDN delivery.

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Navigate to [vercel.com](https://vercel.com) and log in with your **GitHub** account.
2. From your dashboard, click **"Add New..."** → **"Project"**.
3. Under **"Import Git Repository"**, find `grab-bill-splitter` and click **"Import"**.
4. Configure the project settings (Vercel automatically detects Vite):
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.
6. In ~30–45 seconds, your deployment will complete! You will receive a live URL such as:
   ```text
   https://grab-bill-splitter-<your-username>.vercel.app
   ```

#### Option B: Deploy via Vercel CLI (Quick Terminal Method)

If you prefer deploying directly from your terminal:

```bash
# Run Vercel CLI via npx (no global install needed)
npx vercel
```
- Follow the interactive prompts:
  - *Set up and deploy?* `Y`
  - *Which scope?* (Select your Vercel account)
  - *Link to existing project?* `N`
  - *Project name?* `grab-bill-splitter`
  - *In which directory is your code located?* `./`
  - *Want to modify settings?* `N`

For production deployment:
```bash
npx vercel --prod
```

---

### Step 3: Test Continuous Deployment (CI/CD)

Once your GitHub repo is connected to Vercel, every `git push` automatically triggers a fresh build and live update:

1. Make a small tweak in [`src/App.jsx`](src/App.jsx) (e.g., customize the header or default tip options).
2. Commit and push:
   ```bash
   git add src/App.jsx
   git commit -m "style: update header styling"
   git push origin main
   ```
3. Check your Vercel Dashboard or open your live URL — your changes will be deployed automatically within seconds!

---

## 💡 Key Concepts Explained

### 1. What is Derived State?
> **Rule of Thumb:** If a value can be computed from existing state or props, do **not** put it in state.

```javascript
// ❌ Redundant state:
const [total, setTotal] = useState(0)

// ✅ Derived state (computes on every render):
const total = (parseFloat(fare) || 0) + (parseFloat(tolls) || 0) + tip
```

### 2. Auto-focusing with `useRef` + `useEffect`
Use `useRef` to hold a direct reference to an input element, and `useEffect` with an empty dependency array (`[]`) to execute code once when the component mounts:

```javascript
const fareInputRef = useRef(null)

useEffect(() => {
  fareInputRef.current?.focus()
}, [])
```

### 3. Copy to Clipboard with Feedback
```javascript
const handleCopy = async () => {
  setIsCopying(true)
  try {
    await navigator.clipboard.writeText(shareText)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  } finally {
    setIsCopying(false)
  }
}
```

---

## 🌟 Bonus Challenges (Fast-Finishers)

Completed early? Challenge yourself with these extensions:

1. 💱 **Currency Switcher**: Add a toggle between SGD (`$`), MYR (`RM`), and USD (`$`).
2. 👥 **Uneven Split**: Allow assigning specific toll fees or custom amounts to individual passengers.
3. 💾 **LocalStorage Sync**: Save the user's preferred ride type and last entered split details so they persist across page refreshes.
4. 📱 **QR Code Payment**: Integrate a lightweight QR library (like `qrcode.react`) to generate a PayNow / payment QR code directly on the request screen.
5. 🤖 **Create a Custom Agent Skill**: Try authoring your own skill in `.agents/skills/` (e.g., a test generator or currency conversion helper).
6. 🌐 **Custom Domain on Vercel**: Connect a personal domain to your Vercel project settings.

---

## 🆘 Need Help?

- **Stuck on syntax?** Check the step-by-step snippets in [`reference_code/TEMPLATES.md`](reference_code/TEMPLATES.md).
- **Want to see the final working code?** Check out [`reference_code/SampleCode.jsx`](reference_code/SampleCode.jsx).
- **Need help with agent skills?** View the instructions in each skill's [`SKILL.md`](.agents/skills/frontend-design-integration/SKILL.md).
- **Ask your workshop instructor or mentor anytime!**

Happy Coding! 🚀
