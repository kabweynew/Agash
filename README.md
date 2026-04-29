# Agash Tracker

Truck tracking PWA for Agash — Djibouti.

## Features
- Live sync across all devices via Firebase Firestore
- Works offline (service worker caching)
- Installable as an app on Android & iPhone
- Role-based login: Admin, Foreman, Post, Sealer
- Track trucks by plate, type, status, and post
- Daily reports and Excel export

## Files
| File | Purpose |
|------|---------|
| `index.html` | Main app (single file) |
| `manifest.json` | PWA install config |
| `sw.js` | Service worker (offline + caching) |
| `icons/` | App icons (192px and 512px) |

## How to deploy
1. Upload all files to your GitHub repo
2. Go to **Settings → Pages → Source → main branch**
3. Your app will be live at `https://yourname.github.io/agash/`

## Firebase
Connected to Firestore project: `haaa-3b06e`
Collections used: `kab_trucks`, `kab_config`, `kab_incoming`
