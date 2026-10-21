import React from "react";

import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  UsersRound,
  Settings,
  ChevronRight,
  LogOut,
  LockKeyhole,
  Pencil,
} from "lucide-react";

import translations from "./translations";
import "./profile.css";

export default function Profile({
  language = "ENG",
  onEditProfile,
  onEmergencyContacts,
  onSecurity,
  onSettings,
  onLogout,
}) {
  const isBM = language === "BM";

  // Page translations
  const t = {
    title: isBM ? "Profil" : "Profile",

    subtitle: isBM
      ? "Urus akaun dan tetapan keselamatan anda"
      : "Manage your account and safety settings",

    member: isBM
      ? "Ahli MySafety"
      : "MySafety Member",

    personalInfo: isBM
      ? "Maklumat Peribadi"
      : "Personal Information",

    fullName: isBM
      ? "Nama Penuh"
      : "Full Name",

    email: isBM
      ? "Alamat E-mel"
      : "Email Address",

    phone: isBM
      ? "Nombor Telefon"
      : "Phone Number",

    emergencyContacts: isBM
      ? "Kenalan Kecemasan"
      : "Emergency Contacts",

    emergencyDescription: isBM
      ? "Tambah dan urus kenalan dipercayai anda untuk kecemasan."
      : "Add and manage your trusted contacts in case of an emergency.",

    appSettings: isBM
      ? "Tetapan Aplikasi"
      : "App Settings",

    accountSecurity: isBM
      ? "Keselamatan Akaun"
      : "Account Security",

    securityDescription: isBM
      ? "Urus tetapan privasi dan keselamatan anda."
      : "Manage your privacy and security settings.",

    logout: isBM
      ? "Log Keluar"
      : "Log Out",

    footer: isBM
      ? "Keselamatan anda keutamaan kami"
      : "Your safety matters",
  };

  // Replace these with real user data when authentication is implemented.
  const user = {
    name: "Your Name",
    email: "yourname@email.com",
    phone: "+60 12-345 6789",
  };

  return (
    <main className="profile-page">

      {/* Header */}
      <header className="profile-header">
         {/* Page Title */}
      <section className="profile-heading">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>



        {/* <button
          className="profile-settings-button"
          type="button"
          onClick={onSettings}
          aria-label={t.appSettings}
        >
          <Settings size={22} />
        </button> */}

      </header>

     

      {/* User Profile Card */}
      <section className="profile-user-card">

        <div className="profile-avatar">
          <UserRound size={47} strokeWidth={1.7} />
        </div>

        <div className="profile-user-details">

          <h2>{user.name}</h2>

          <p>{user.email}</p>

          <span className="profile-member-badge">
            <ShieldCheck size={16} />
            {t.member}
          </span>

        </div>

        <button
          className="profile-edit-button"
          type="button"
          onClick={onEditProfile}
          aria-label={isBM ? "Sunting profil" : "Edit profile"}
        >
          <Pencil size={19} />
        </button>

      </section>

      {/* Personal Information */}
      <section className="profile-section">

        <div className="profile-section-heading">
          <UserRound size={25} />
          <h3>{t.personalInfo}</h3>
        </div>

        <div className="profile-card">

          <ProfileRow
            icon={<UserRound size={23} />}
            label={t.fullName}
            value={user.name}
          />

          <ProfileRow
            icon={<Mail size={23} />}
            label={t.email}
            value={user.email}
          />

          <ProfileRow
            icon={<Phone size={23} />}
            label={t.phone}
            value={user.phone}
          />

        </div>

      </section>

      {/* Emergency Contacts */}
      <section className="profile-section">

        <div className="profile-section-heading">
          <UsersRound size={25} />
          <h3>{t.emergencyContacts}</h3>
        </div>

        <button
          className="profile-menu-card"
          type="button"
          onClick={onEmergencyContacts}
        >

          <div className="profile-row-icon profile-emergency-icon">
            <UsersRound size={24} />
          </div>

          <div className="profile-row-content">
            <h4>{t.emergencyContacts}</h4>
            <p>{t.emergencyDescription}</p>
          </div>

          <ChevronRight
            size={23}
            className="profile-chevron"
          />

        </button>

      </section>

      {/* App Settings */}
      <section className="profile-section">

        <div className="profile-section-heading">
          <Settings size={25} />
          <h3>{t.appSettings}</h3>
        </div>

        <button
          className="profile-menu-card"
          type="button"
          onClick={onSettings}
        >

          <div className="profile-row-icon">
            <Settings size={23} />
          </div>

          <div className="profile-row-content">
            <h4>{t.appSettings}</h4>
            <p>
              {isBM
                ? "Urus pilihan aplikasi anda."
                : "Manage your app preferences."}
            </p>
          </div>

          <ChevronRight
            size={23}
            className="profile-chevron"
          />

        </button>

      </section>

      {/* Privacy & Security */}
      <section className="profile-section">

        <div className="profile-section-heading">
          <ShieldCheck size={25} />
          <h3>
            {isBM ? "Privasi & Keselamatan" : "Privacy & Security"}
          </h3>
        </div>

        <button
          className="profile-menu-card"
          type="button"
          onClick={onSecurity}
        >

          <div className="profile-row-icon">
            <LockKeyhole size={23} />
          </div>

          <div className="profile-row-content">
            <h4>{t.accountSecurity}</h4>
            <p>{t.securityDescription}</p>
          </div>

          <ChevronRight
            size={23}
            className="profile-chevron"
          />

        </button>

      </section>

      {/* Log Out */}
      <button
        className="profile-logout-button"
        type="button"
        onClick={onLogout}
      >
        <LogOut size={21} />
        <span>{t.logout}</span>
      </button>

      {/* Footer */}
      <footer className="profile-footer">
        <span>MySafety</span>
        <p>{t.footer}</p>
      </footer>

    </main>
  );
}


/* Reusable personal information row */
function ProfileRow({ icon, label, value }) {
  return (
    <div className="profile-info-row">

      <div className="profile-row-icon">
        {icon}
      </div>

      <div className="profile-row-content">
        <h4>{label}</h4>
        <p>{value}</p>
      </div>

      <ChevronRight
        size={23}
        className="profile-chevron"
      />

    </div>
  );
}