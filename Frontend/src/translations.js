const translations = {
  BM: {
    common: {
      home: "Utama",
      location: "Lokasi",
      report: "Lapor",
      supports: "Sokongan",
      profile: "Profil",

      verified: "Disahkan",
      pending: "Menunggu",

      today: "Hari ini",
      yesterday: "Semalam",

      back: "Kembali",
      next: "Seterusnya"
    },

    dashboard: {
      selectedLocation: "Lokasi dipilih",
      getLocation: "Dapatkan lokasi",
      incidents: "Insiden",
      all: "Semua",
      distanceUnavailable: "Jarak tidak tersedia"
    },

    incidentTypes: {
      assault: "Serangan",
      robbery: "Rompakan",
      rape: "Rogol",
      murder: "Pembunuhan",
      sexualHarassment: "Gangguan Seksual",

      scam: "Penipuan / Scam",
      harassment: "Panggilan Gangguan",
      financial: "Penipuan Kewangan",
      suspicious: "Aktiviti Mencurigakan",
      other: "Lain-lain"
    },

    incidentDescriptions: {
      assaultArea:
        "Seorang lelaki dilihat menyerang individu lain berhampiran tepi jalan. Mangsa kelihatan cedera sebelum penyerang meninggalkan kawasan tersebut.",

      robberyNearby:
        "Seorang individu melaporkan bahawa mereka didatangi oleh seorang perompak yang mengambil barang milik mereka sebelum melarikan diri dari kawasan tersebut.",

      assaultCommercial:
        "Pergaduhan fizikal dilaporkan berhampiran kawasan komersial. Seorang individu dilihat dipukul beberapa kali sebelum orang lain campur tangan.",

      robberyResidential:
        "Seorang penduduk melaporkan bahawa barang miliknya dicuri berhampiran kawasan perumahan oleh individu yang tidak dikenali.",

      rapeNearby:
        "Satu kejadian serangan seksual dilaporkan berhampiran kawasan tersebut. Mangsa membuat laporan selepas berjaya pergi ke tempat yang lebih selamat.",

      personalBelongingStolen:
        "Seorang individu melaporkan bahawa barang peribadinya telah dicuri semasa berada di kawasan tersebut.",

      rapeReported:
        "Satu kejadian serangan seksual dilaporkan di kawasan tersebut. Mangsa kemudian memaklumkan kepada seseorang yang dipercayai dan membuat laporan."
    },

  
    details: {
      noTime: "Tiada Masa",
      noLocation: "Tiada Lokasi",
      incidentWarning: "Sila sentiasa berwaspada semasa melalui kawasan ini.",
      privacywarning: "Lokasi ini dipaparkan secara anggaran untuk melindungi privasi individu yang terlibat.",
      approximateLocation: "Jarak Anggaran",

      safetyAdviceTitle: "Nasihat Keselamatan",

      safetyAdvice: {
        Assault: [
          "Elakkan kawasan tersebut jika boleh.",
          "Kekal di kawasan yang terang dan sibuk.",
          "Laporkan sebarang aktiviti mencurigakan kepada pihak berkuasa."
        ],

        Robbery: [
          "Elakkan daripada mempamerkan barang berharga.",
          "Sentiasa berwaspada dan gunakan laluan yang terang.",
          "Laporkan aktiviti mencurigakan kepada pihak berkuasa."
        ],

        Rape: [
          "Elakkan kawasan tersebut jika boleh.",
          "Bergerak bersama individu yang dipercayai jika boleh.",
          "Hubungi pihak berkuasa jika anda berasa tidak selamat."
        ],

        default: [
          "Sentiasa berwaspada dengan persekitaran anda.",
          "Kekal di kawasan yang terang dan sibuk.",
          "Laporkan aktiviti mencurigakan kepada pihak berkuasa."
        ]
      }
    },



    locationPage: {
      searchPlaceholder: "Cari kawasan atau lokasi...",
      yourLocation: "Lokasi Anda",
      status: "Status",
      location: "Lokasi",
      time: "Masa",
      description: "Penerangan"
    },

    report: {
      title: "Laporkan Insiden",
      subtitle: "Bantu kami memastikan keselamatan komuniti.",

      steps: ["Jenis Insiden", "Lokasi", "Butiran"],
      step: "LANGKAH",
      of: "DARIPADA",

      chooseIncident: "Pilih Jenis Insiden",
      incidentQuestion: "Apakah jenis insiden yang ingin anda laporkan?",

      locationTitle: "Tetapkan Lokasi Insiden",
      locationQuestion: "Di manakah insiden tersebut berlaku?",
      searchLocation: "Cari lokasi",
      locationPlaceholder: "Masukkan alamat atau tempat",
      searchButton: "Cari lokasi",
      mapInstruction: "Tekan pada peta untuk menandakan lokasi insiden.",
      selectedLocation: "Lokasi Dipilih",
      noLocation: "Tiada lokasi dipilih",
      radius: "Jejari anggaran",
      radiusHint: "Pilih anggaran kawasan di sekitar lokasi insiden.",

      detailsTitle: "Butiran Tambahan",
      detailsQuestion: "Berikan maklumat lanjut tentang insiden tersebut.",
      incidentDate: "Tarikh Insiden",
      incidentTime: "Masa Insiden",
      description: "Keterangan",
      descriptionPlaceholder:
        "Terangkan perkara yang berlaku, termasuk maklumat yang berkaitan...",

      addPhotos: "Tambah Foto",
      uploadPhotos: "Tekan untuk memuat naik foto",
      photoFormats: "JPG, PNG atau format imej lain · Maksimum 5 MB setiap satu",
      photoLimit: "Sehingga 5 foto",

      summary: "Ringkasan Laporan",
      incident: "Insiden:",
      location: "Lokasi:",
      back: "Kembali",
      next: "Seterusnya",
      submit: "Hantar Laporan",

      footer:
        "Sila berikan maklumat yang tepat untuk membantu kami menyemak laporan anda.",

      errors: {
        selectIncident: "Sila pilih jenis insiden.",
        selectLocation:
          "Sila cari lokasi atau pilih lokasi pada peta.",
        enterLocation: "Sila masukkan lokasi untuk dicari.",
        searchFailed: "Carian lokasi gagal.",
        locationNotFound:
          "Lokasi tidak dijumpai. Sila cuba lokasi lain.",
        searchError:
          "Lokasi tidak dapat dicari. Sila cuba lagi.",
        photoSize:
          "Hanya imej bersaiz maksimum 5 MB setiap satu dibenarkan.",
        requiredDetails:
          "Sila masukkan tarikh, masa dan keterangan insiden.",
        photoRequired: "Sila muat naik sekurang-kurangnya satu foto."
      },

      successTitle: "Laporan Berjaya Dihantar!",
      successMessage:
        "Laporan anda telah disediakan dengan jayanya. Sambungkan fungsi penghantaran kepada bahagian belakang sistem untuk menyimpan laporan secara kekal.",
      createAnother: "Buat Laporan Baharu",
      removePhoto: "Buang foto",

      locationDetails: "Butiran Lokasi",
      locationDetailsPlaceholder:
        "Contoh: Nama bangunan, nama jalan, tingkat, nombor unit",
    },

    support: {
      title: "Sokongan",
      subtitle: "Cari jawapan atau dapatkan panduan.",
      searchPlaceholder: "Cari topik sokongan...",
      emergencyTitle: "Perlukan bantuan segera?",
      emergencyText: "Hubungi 999 jika anda berada dalam bahaya.",
      call999: "Hubungi 999",
      faqTitle: "Soalan Lazim",
      faqSubtitle: "Pilih kategori untuk mencari jawapan.",
      aiAssistant: "Pembantu AI",
      aiSubtitle: "Pembantu keselamatan anda",
      typeMessage: "Taip mesej anda...",
      robberyQuick: "Apa perlu saya lakukan selepas rompakan?",
      reportQuick: "Bagaimana membuat laporan?",
      safetyQuick: "Berikan tip keselamatan",
      categories: {
        generalSafety: "Keselamatan Umum",
        rapeSexualAssault: "Rogol & Serangan Seksual",
        sexualHarassment: "Gangguan Seksual",
        murderViolence: "Pembunuhan & Keganasan Serius",
        robbery: "Rompakan",
        physicalAssault: "Serangan Fizikal"
      }
    }
  },

  ENG: {
    common: {
      home: "Home",
      location: "Location",
      report: "Report",
      supports: "Support",
      profile: "Profile",

      verified: "Verified",
      pending: "Pending",

      today: "Today",
      yesterday: "Yesterday",

      back: "Back",
      next: "Next"
    },

    dashboard: {
      selectedLocation: "Selected location",
      getLocation: "Get Location",
      incidents: "Incidents",
      all: "All",
      distanceUnavailable: "Distance unavailable"
    },

    incidentTypes: {
      assault: "Assault",
      robbery: "Robbery",
      rape: "Rape",
      murder: "Murder",
      sexualHarassment: "Sexual Harassment",

      scam: "Scam / Fraud",
      harassment: "Harassment Calls",
      financial: "Financial Fraud",
      suspicious: "Suspicious Activity",
      other: "Other"
    },

    incidentDescriptions: {
      assaultArea:
        "A man was seen attacking another person near the roadside. The victim appeared to be injured before the attacker left the area.",

      robberyNearby:
        "A person reported being approached by a robber who took their belongings before quickly leaving the area.",

      assaultCommercial:
        "A physical fight was reported near the commercial area. One person was seen being hit several times before others intervened.",

      robberyResidential:
        "A resident reported that their belongings were stolen near the residential area by an unknown individual.",

      rapeNearby:
        "A sexual assault was reported near the surrounding area. The incident was reported by the victim after reaching a safer location.",

      personalBelongingStolen:
        "A person reported that their personal belongings were stolen while they were in the area.",

      rapeReported:
        "A sexual assault was reported in the area. The victim later informed someone they trusted and reported the incident."
    },

    details: {
      noTime: "Time unavailable",
      noLocation: "Location unavailable",
      incidentWarning: "Please remain cautious when travelling in this area.",
      privacywarning: "This location is shown approximately to protect the privacy of individuals involved.",
      approximateLocation: "Approximate Location",

      safetyAdviceTitle: "Safety Advice",

      safetyAdvice: {
        Assault: [
          "Avoid the area if possible.",
          "Stay in well-lit and busy areas.",
          "Report any suspicious activity to authorities."
        ],

        Robbery: [
          "Avoid displaying valuable belongings.",
          "Stay alert and use well-lit routes.",
          "Report suspicious activity to authorities."
        ],

        Rape: [
          "Avoid the area if possible.",
          "Travel with trusted companions when possible.",
          "Contact the authorities if you feel unsafe."
        ],

        default: [
          "Stay alert and remain aware of your surroundings.",
          "Stay in well-lit and busy areas.",
          "Report suspicious activity to authorities."
        ]
      }
    },

    locationPage: {
      searchPlaceholder: "Search area or location...",
      yourLocation: "Your Location",
      status: "Status",
      location: "Location",
      time: "Time",
      description: "Description"
    },

    report: {
      title: "Report an Incident",
      subtitle: "Help us keep the community safe.",

      steps: ["Incident Type", "Location", "Details"],
      step: "STEP",
      of: "OF",

      chooseIncident: "Choose Incident Type",
      incidentQuestion: "What type of incident would you like to report?",

      locationTitle: "Set Incident Location",
      locationQuestion: "Where did the incident happen?",
      searchLocation: "Search location",
      locationPlaceholder: "Enter an address or place",
      searchButton: "Search location",
      mapInstruction: "Tap the map to mark the incident location.",
      selectedLocation: "Selected Location",
      noLocation: "No location selected yet",
      radius: "Approximate radius",
      radiusHint: "Choose the approximate area around the incident.",

      detailsTitle: "Additional Details",
      detailsQuestion: "Provide more information about the incident.",
      incidentDate: "Incident Date",
      incidentTime: "Incident Time",
      description: "Description",
      descriptionPlaceholder:
        "Describe what happened, including any relevant details...",

      addPhotos: "Add Photos",
      uploadPhotos: "Tap to upload photos",
      photoFormats:
        "JPG, PNG or other image formats · Max 5 MB each",
      photoLimit: "Up to 5 photos",

      summary: "Report Summary",
      incident: "Incident:",
      location: "Location:",
      back: "Back",
      next: "Next",
      submit: "Submit Report",

      footer:
        "Please provide accurate information to help us review your report.",

      errors: {
        selectIncident: "Please select an incident type.",
        selectLocation:
          "Please search for a location or select one on the map.",
        enterLocation: "Please enter a location to search.",
        searchFailed: "Location search failed.",
        locationNotFound:
          "Location not found. Please try another search.",
        searchError:
          "Unable to search for the location. Please try again.",
        photoSize:
          "Only images up to 5 MB each are allowed.",
        requiredDetails:
          "Please provide the incident date, time, and description.",
        photoRequired: "Please upload at least one photo."
      },

      successTitle: "Report Submitted!",
      successMessage:
        "Your report has been prepared successfully. Connect the submission handler to your backend to save it permanently.",
      createAnother: "Create Another Report",
      removePhoto: "Remove photo",
      locationDetails: "Location Details",
      locationDetailsPlaceholder:
        "e.g. Building name, street name, floor, unit number",
    },

    support: {
      title: "Support",
      subtitle: "Find answers or get guidance.",
      searchPlaceholder: "Search support topics...",
      emergencyTitle: "Need immediate help?",
      emergencyText: "Call 999 if you are in danger.",
      call999: "Call 999",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Choose a category to find answers.",
      aiAssistant: "AI Assistant",
      aiSubtitle: "Your safety support companion",
      typeMessage: "Type your message...",
      robberyQuick: "What should I do after a robbery?",
      reportQuick: "How do I make a report?",
      safetyQuick: "Give me safety tips",

      categories: {
        generalSafety: "General Safety",
        rapeSexualAssault: "Rape & Sexual Assault",
        sexualHarassment: "Sexual Harassment",
        murderViolence: "Murder & Serious Violence",
        robbery: "Robbery",
        physicalAssault: "Physical Assault"
      }
    }
  }
}

export default translations