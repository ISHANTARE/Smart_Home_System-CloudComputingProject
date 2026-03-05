# SmartH — Smart Home Dashboard

> IoT-based Smart Home System — Cloud Computing Project (B.Tech CSE 3rd Year)

## Overview

SmartH is a modern, responsive smart home dashboard built with **React 18**, **Vite 5**, and **Tailwind CSS**. It allows users to monitor and control IoT devices, lights, climate systems, and energy usage across multiple rooms in real-time.

## Features

- **Multi-Room Management** — Switch between rooms (Living Room, Kitchen, Bedroom, etc.) with independent device/climate states
- **Device Control** — Toggle smart devices on/off with real-time status updates
- **Climate Control** — Interactive circular temperature gauge for AC, speed controls for exhaust/chimney
- **Light Management** — Dot-slider brightness control for each light with visual glow feedback
- **Energy Monitoring** — Bar chart visualization of hourly energy usage with peak detection
- **Add Rooms & Devices** — Dynamically add new rooms and devices via modal dialogs
- **Search** — Filter devices across the active room
- **Notifications** — Bell dropdown with sample IoT event notifications
- **Settings Page** — System info, profile, cloud sync sections
- **Responsive Design** — Full mobile support with collapsible sidebar
- **Dark Theme** — Premium dark UI with glassmorphism and micro-animations

## Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | React 18 + JSX       |
| Build      | Vite 5               |
| Styling    | Tailwind CSS 3       |
| Icons      | Lucide React         |
| State      | React Context API    |
| Deployment | AWS S3 + CloudFront  |

## Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smarth-dashboard.git
cd smarth-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

The output will be in the `dist/` folder, ready for deployment.

## AWS Deployment Guide

### Option 1: S3 + CloudFront (Recommended for Static Sites)

1. **Create an S3 Bucket**
   ```bash
   aws s3 mb s3://smarth-dashboard --region ap-south-1
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://smarth-dashboard --delete
   ```

4. **Enable Static Website Hosting**
   - Go to S3 → Bucket → Properties → Static website hosting
   - Set Index document: `index.html`
   - Set Error document: `index.html` (for SPA routing)

5. **Set Bucket Policy for Public Access**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::smarth-dashboard/*"
     }]
   }
   ```

6. **(Optional) Create CloudFront Distribution** for HTTPS and CDN caching.

### Option 2: EC2 Instance

1. Launch an EC2 instance (Amazon Linux 2 / Ubuntu)
2. Install Node.js and Nginx
3. Upload the `dist/` folder to `/var/www/html/`
4. Configure Nginx to serve the SPA:
   ```nginx
   server {
       listen 80;
       root /var/www/html;
       index index.html;
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Project Structure

```
src/
├── context/
│   └── SmartHomeContext.jsx    # Global state management
├── components/
│   ├── Sidebar.jsx            # Navigation sidebar
│   ├── Header.jsx             # Top bar with search, notifications, profile
│   ├── RoomTabs.jsx           # Room tab switcher
│   ├── ClimateControl.jsx     # AC / Exhaust controls
│   ├── TemperatureGauge.jsx   # Circular temp dial (SVG)
│   ├── UsageStatus.jsx        # Energy usage bar chart
│   ├── MyDevices.jsx          # Device grid container
│   ├── DeviceCard.jsx         # Individual device card
│   ├── LightPanel.jsx         # Light controls container
│   ├── LightItem.jsx          # Individual light with dot slider
│   ├── DotSlider.jsx          # Draggable dot brightness slider
│   ├── ToggleSwitch.jsx       # Reusable toggle component
│   ├── AddRoomModal.jsx       # Add room dialog
│   ├── AddDeviceModal.jsx     # Add device dialog
│   ├── SettingsPage.jsx       # Settings view
│   └── Toast.jsx              # Toast notification
├── data/
│   └── roomsData.js           # Initial room/device seed data
├── App.jsx                    # Root app with routing
├── main.jsx                   # React entry point
└── index.css                  # Global styles + animations
```

## License

This project is for educational purposes (VIT University — Cloud Computing Course).
