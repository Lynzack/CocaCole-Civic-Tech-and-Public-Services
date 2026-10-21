import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Map,
  Plus,
  Headphones,
  User,
} from "lucide-react";

import "./App.css";
import Dashboard from "./Dashboard";
import Location from "./Locations";
import ReportIncident from "./ReportIncident";
import IncidentDetails from "./IncidentDetails";
import Support from "./Support";
import Profile from "./profile";

const API_BASE = (
  import.meta.env?.VITE_API_BASE_URL ||
  "http://127.0.0.1:5001"
).replace(/\/+$/, "");

const INCIDENT_TYPES = [
  {
    value: "assault",
    key: "assault",
    legacy: "Assault",
  },
  {
    value: "robbery",
    key: "robbery",
    legacy: "Robbery",
  },
  {
    value: "rape",
    key: "rape",
    legacy: "Rape",
  },
  {
    value: "murder",
    key: "murder",
    legacy: "Murder",
  },
  {
    value: "sexual harassment",
    key: "sexualHarassment",
    legacy: "Sexual Harassment",
  },
];

function coordinate(value, max) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) &&
    Math.abs(number) <= max
    ? number
    : null;
}

function normalizeIncident(record) {
  if (
    !record ||
    typeof record.incident_id !== "string" ||
    !["verified", "unverified"].includes(
      record.verification_status
    )
  ) {
    throw new Error(
      "Invalid published incident response."
    );
  }

  const category = INCIDENT_TYPES.find(
    (type) => type.value === record.incident_type
  );

  return {
    id: record.incident_id,
    type: category?.legacy || record.incident_type,
    typeKey: category?.key,
    category: record.incident_type,

    latitude: coordinate(record.public_latitude, 90),
    longitude: coordinate(record.public_longitude, 180),

    location: record.location_name || "",
    description: record.public_description || "",

    incidentDate: record.incident_date,
    incidentTime: record.incident_time,

    time: [
      record.incident_date,
      record.incident_time,
    ]
      .filter(Boolean)
      .join(", "),

    status:
      record.verification_status === "verified"
        ? "Verified"
        : "Unverified",

    verificationStatus: record.verification_status,
    radius: record.approximate_radius_m,

    sources: Array.isArray(record.sources)
      ? record.sources
      : [],
  };
}

function incidentTypeLabel(incident, translations) {
  return (
    translations.incidentTypes?.[incident.typeKey] ||
    incident.type
  );
}

function incidentStatusLabel(
  incident,
  translations,
  language
) {
  return incident.verificationStatus === "verified"
    ? translations.common.verified
    : translations.common.unverified ||
        (language === "BM"
          ? "Belum Disahkan"
          : "Unverified");
}

function formatIncidentTime(incident, language) {
  const locale =
    language === "BM" ? "ms-MY" : "en-GB";

  const date = incident.incidentDate;

  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return language === "BM"
      ? "Tarikh tidak tersedia"
      : "Date unavailable";
  }

  const time = incident.incidentTime;

  const hasTime =
    typeof time === "string" &&
    /^\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(time);

  // Stored incident times use Malaysian local time.
  const stamp = new Date(
    `${date}T${hasTime ? time : "00:00:00"}+08:00`
  );

  if (!Number.isFinite(stamp.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(hasTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(stamp);
}

function distanceKm(latitude, longitude, incident) {
  if (
    latitude == null ||
    longitude == null ||
    incident.latitude == null ||
    incident.longitude == null
  ) {
    return null;
  }

  const lat = coordinate(latitude, 90);
  const lon = coordinate(longitude, 180);

  if (lat === null || lon === null) {
    return null;
  }

  const radians = Math.PI / 180;

  const a =
    Math.sin(
      ((incident.latitude - lat) * radians) / 2
    ) ** 2 +
    Math.cos(lat * radians) *
      Math.cos(incident.latitude * radians) *
      Math.sin(
        ((incident.longitude - lon) * radians) / 2
      ) ** 2;

  return (
    6371 *
    2 *
    Math.asin(
      Math.sqrt(Math.max(0, Math.min(1, a)))
    )
  );
}

async function getJson(path, signal) {
  const controller = new AbortController();
  const cancel = () => controller.abort();

  if (signal?.aborted) {
    cancel();
  }

  signal?.addEventListener("abort", cancel, {
    once: true,
  });

  const timer = setTimeout(cancel, 45000);

  try {
    const response = await fetch(
      `${API_BASE}${path}`,
      {
        signal: controller.signal,
      }
    );

    const body = await response
      .json()
      .catch(() => null);

    if (!response.ok || body?.success !== true) {
      throw new Error(
        body?.message ||
          `Request failed (${response.status}).`
      );
    }

    return body;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
  }
}

async function fetchIncidentPage({
  category = "",
  offset = 0,
  signal,
} = {}) {
  const params = new URLSearchParams({
    limit: "20",
    offset: String(offset),
  });

  if (category) {
    params.set("category", category);
  }

  const body = await getJson(
    `/api/incidents?${params}`,
    signal
  );

  if (!Array.isArray(body.incidents)) {
    throw new Error(
      "Invalid incident list response."
    );
  }

  const hasMore =
    body.pagination?.has_more === true;

  const nextOffset =
    body.pagination?.next_offset;

  if (
    hasMore &&
    (!Number.isInteger(nextOffset) ||
      nextOffset <= offset)
  ) {
    throw new Error(
      "Invalid incident pagination response."
    );
  }

  return {
    incidents: body.incidents.map(normalizeIncident),
    hasMore,
    nextOffset: hasMore ? nextOffset : null,
  };
}

async function fetchIncidentDetails(id, signal) {
  const body = await getJson(
    `/api/incidents/${encodeURIComponent(id)}`,
    signal
  );

  const incident = normalizeIncident(body.incident);

  if (incident.id !== id) {
    throw new Error(
      "Incident ID did not match the request."
    );
  }

  return incident;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState("BM");
  const [selectedIncident, setSelectedIncident] =
    useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  const [locationError, setLocationError] = useState("");

  const [incidents, setIncidents] = useState([]);
  const [mapIncidents, setMapIncidents] = useState([]);

  const [feedQuery, setFeedQuery] = useState({
    category: "",
    offset: 0,
  });

  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState("");

  const [pagination, setPagination] = useState({
    hasMore: false,
    nextOffset: null,
  });

  useEffect(() => {
    if (activeTab !== "dashboard") return;

    const controller = new AbortController();

    setFeedLoading(true);
    setFeedError("");
    setPagination({
      hasMore: false,
      nextOffset: null,
    });

    if (feedQuery.offset === 0) {
      setIncidents([]);
    }

    fetchIncidentPage({
      ...feedQuery,
      signal: controller.signal,
    })
      .then((page) => {
        if (controller.signal.aborted) return;

        const merge = (previous) => [
          ...new Map(
            [...previous, ...page.incidents].map(
              (incident) => [
                incident.id,
                incident,
              ]
            )
          ).values(),
        ];

        setIncidents((previous) =>
          feedQuery.offset === 0
            ? page.incidents
            : merge(previous)
        );

        if (!feedQuery.category) {
          setMapIncidents((previous) =>
            feedQuery.offset === 0
              ? page.incidents
              : merge(previous)
          );
        }

        setPagination({
          hasMore: page.hasMore,
          nextOffset: page.nextOffset,
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setFeedError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setFeedLoading(false);
        }
      });

    return () => controller.abort();
  }, [activeTab, feedQuery]);

  function refreshIncidents() {
    setFeedQuery((query) => ({
      category: query.category,
      offset: 0,
    }));
  }

  function showDashboard() {
    setSelectedIncident(null);
    refreshIncidents();
    setActiveTab("dashboard");
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported on this device."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        const placeName = await getPlaceName(lat, lng);
        setUserLocation(placeName);
        setLocationError("");
      },
      (error) => {
        console.error(error);
        setLocationError(
          "Unable to get your location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getPlaceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();
      const address = data.address;

      const area =
        address.suburb ||
        address.neighbourhood ||
        address.village ||
        address.town ||
        address.city ||
        "";

      const state = address.state || "";

      return `${area}${area && state ? ", " : ""}${state}`;
    } catch (error) {
      console.error(
        "Reverse geocoding failed:",
        error
      );
      return "Location unavailable";
    }
  };

  return (
    <div className="page">
      <main className="card-container">
        <header className="header">
          <span className="logo-text">MYSafety</span>

          <div className="language-toggle">
            <button
              type="button"
              className={
                language === "BM" ? "active" : ""
              }
              onClick={() => setLanguage("BM")}
            >
              BM
            </button>

            <span className="language-divider">
              |
            </span>

            <button
              type="button"
              className={
                language === "ENG" ? "active" : ""
              }
              onClick={() => setLanguage("ENG")}
            >
              ENG
            </button>
          </div>
        </header>

        <nav className="nav-bar">
          <button
            type="button"
            className={`nav-button ${
              activeTab === "dashboard" ||
              activeTab === "IncidentDetails"
                ? "active"
                : ""
            }`}
            onClick={showDashboard}
          >
            <LayoutDashboard size={22} />
            <span>
              {language === "BM"
                ? "Utama"
                : "Dashboard"}
            </span>
          </button>

          <button
            type="button"
            className={`nav-button ${
              activeTab === "location"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("location")
            }
          >
            <Map size={22} />
            <span>
              {language === "BM"
                ? "Lokasi"
                : "Location"}
            </span>
          </button>

          <button
            type="button"
            className={`nav-button ${
              activeTab === "Report"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("Report")
            }
          >
            <Plus size={22} />
            <span>
              {language === "BM"
                ? "Laporan"
                : "Report"}
            </span>
          </button>

          <button
            type="button"
            className={`nav-button ${
              activeTab === "Support"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("Support")
            }
          >
            <Headphones size={22} />
            <span>
              {language === "BM"
                ? "Sokongan"
                : "Support"}
            </span>
          </button>

          <button
            type="button"
            className={`nav-button ${
              activeTab === "Profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("Profile")
            }
          >
            <User size={22} />
            <span>
              {language === "BM"
                ? "Profil"
                : "Profile"}
            </span>
          </button>
        </nav>

        {activeTab === "dashboard" && (
          <Dashboard
            getCurrentLocation={getCurrentLocation}
            userLocation={userLocation}
            locationError={locationError}
            incidents={incidents}
            incidentTypes={INCIDENT_TYPES}
            incidentTypeLabel={incidentTypeLabel}
            incidentStatusLabel={incidentStatusLabel}
            formatIncidentTime={formatIncidentTime}
            distanceKm={distanceKm}
            selectedFilter={feedQuery.category}
            onFilterChange={(category) =>
              setFeedQuery({
                category,
                offset: 0,
              })
            }
            loading={feedLoading}
            feedError={feedError}
            hasMore={pagination.hasMore}
            onRefresh={refreshIncidents}
            onLoadMore={() => {
              if (
                !feedLoading &&
                pagination.hasMore
              ) {
                setFeedQuery((query) => ({
                  ...query,
                  offset: pagination.nextOffset,
                }));
              }
            }}
            latitude={latitude}
            longitude={longitude}
            language={language}
            onIncidentClick={(incident) => {
              setSelectedIncident(incident);
              setActiveTab("IncidentDetails");
            }}
          />
        )}

        {activeTab === "IncidentDetails" &&
          selectedIncident && (
            <IncidentDetails
              incident={selectedIncident}
              fetchIncidentDetails={fetchIncidentDetails}
              incidentTypeLabel={incidentTypeLabel}
              incidentStatusLabel={incidentStatusLabel}
              formatIncidentTime={formatIncidentTime}
              onBack={showDashboard}
              language={language}
            />
          )}

        {activeTab === "location" && (
          <Location
            latitude={latitude}
            longitude={longitude}
            getCurrentLocation={getCurrentLocation}
            incidents={mapIncidents}
            language={language}
          />
        )}

        {activeTab === "Report" && (
          <ReportIncident language={language} />
        )}

        {activeTab === "Support" && (
          <Support language={language} />
        )}

        {activeTab === "Profile" && (
          <Profile language={language} />
        )}
      </main>
    </div>
  );
}