# ✈️ Flight Tracker

> A modern real-time flight tracking application built with **React**, **Leaflet**, and the **OpenSky Network API**. Explore live aircraft positions on an interactive dark-themed world map with detailed flight information.

<p align="center">
  <a href="https://flighttracker-777.web.app"><strong>🌐 Live Demo</strong></a>
</p>

---

## 📖 Overview

Flight Tracker is a web application that displays live aircraft across the world using real-time data from the OpenSky Network.

Users can:

- 🌍 View aircraft on an interactive map
- 🔍 Search flights by callsign
- ✈️ Track aircraft in real time
- 📍 Follow a selected aircraft
- 📊 View altitude, speed, airline, aircraft type, route, and more
- 🚨 Detect emergency squawk codes

---

# 📸 Screenshots


| World Map | 
|-----------|
| <img width="1920" height="920" alt="Screenshot 2026-02-21 133420" src="https://github.com/user-attachments/assets/ebe3b28b-a6dd-44e3-89c0-ffc2fc9d7a79" />

|Flight Details| 
|-----------|
| <img width="1920" height="915" alt="Screenshot 2026-02-21 133510" src="https://github.com/user-attachments/assets/82516c2e-1e8e-4afe-8bac-b33d95a81e0d" />

---

# ✨ Features

## 🌍 Live Flight Tracking

- Real-time aircraft positions
- Updates every **15 seconds**
- Interactive dark world map
- Zoom & pan support

---

## 🔍 Flight Search

- Search by callsign
- Instant filtering
- Auto-highlight selected aircraft

---

## ✈ Flight Information

Clicking an aircraft displays:

- Callsign
- ICAO24
- Airline
- Airline logo
- Origin country
- Aircraft manufacturer
- Aircraft model
- Departure airport
- Arrival airport
- Altitude
- Speed
- Heading
- Vertical rate
- Last contact
- Ground status
- Emergency squawk detection

---

## 🗺 Map Features

- Follow aircraft
- Flight trails
- Viewport filtering
- Canvas rendering
- Marker caching
- Optimized for thousands of flights

---

## 📋 Sidebar

- Visible flight list
- Airline logos
- Flight summary
- Selected aircraft details
- Mobile responsive

---

# 🛠 Tech Stack

## Frontend

| Technology | Usage |
|------------|-------|
| React 19 | UI Framework |
| Vite 7 | Build Tool |
| Leaflet | Interactive Maps |
| React Leaflet | React Integration |
| Axios | API Requests |
| PropTypes | Type Checking |

---

## Backend *(Optional)*

| Technology | Usage |
|------------|-------|
| Spring Boot 3 | REST API |
| Java 17 | Runtime |
| Maven | Dependency Management |
| Caffeine | Cache |
| Spring Retry | Retry Logic |

---

## Deployment

- Firebase Hosting
- Firebase CLI
- GitHub Actions

---

## External APIs

| API | Purpose |
|-----|----------|
| OpenSky Network | Live flight data |
| Google Flights CDN | Airline logos |

---

# 📂 Project Structure

```text
flight-tracker
│
├── src
│   ├── components
│   ├── hooks
│   ├── utils
│   ├── App.jsx
│   └── main.jsx
│
├── backend
│
├── public
│
├── package.json
├── vite.config.js
└── firebase.json
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- npm

Optional

- Java 17
- Maven

---

## Installation

```bash
git clone https://github.com/yourusername/flight-tracker.git

cd flight-tracker

npm install
```

---

## Run Frontend

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

## Run Backend

```bash
cd backend

mvn spring-boot:run
```

---

## Build

```bash
npm run build
```

---

## Deploy

```bash
firebase deploy --only hosting
```

---

# 🔌 API Endpoints

## OpenSky

| Endpoint | Description |
|----------|-------------|
| `/states/all` | Live aircraft positions |
| `/flights/aircraft` | Flight history |
| `/metadata/aircraft/{icao24}` | Aircraft information |

---

# 🎨 UI Highlights

- Dark theme
- Glassmorphism
- Responsive layout
- Flight trails
- Smooth animations
- Modern sidebar
- Interactive popups

---

# ⚡ Performance Optimizations

- Canvas rendering
- Cached aircraft icons
- Marker clustering strategy
- Limited visible markers
- Efficient polling
- Bounds filtering

---

# 📄 License

This project is intended for educational and personal use.

Flight data is provided by the **OpenSky Network**.

---

# 🙏 Acknowledgements

- OpenSky Network
- Leaflet
- CARTO
- Google Flights

---

<p align="center">


</p>

## Author
 
Yaseen Affan
 
