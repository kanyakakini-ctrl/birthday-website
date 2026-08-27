# 🎂 Interactive Birthday Surprise Website

A magical, responsive, and cute interactive birthday surprise website built with React, Vite, Framer Motion, Tailwind CSS, and a lightweight Node.js/Express backend.

---

## 📸 HOW TO ADD YOUR OWN PICTURES (BEGINNER GUIDE)

You can add and customize all your pictures in **3 simple steps**:

### Step 1: Put your picture files in the photos folder
Copy your JPG, PNG, or WEBP photos into:
```
public/assets/photos/
```
For example, name them:
- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg`
- `photo5.jpg`

*(Note: You can name them anything you like, e.g. `beach_trip.jpg` or `graduation.png`!)*

---

### Step 2: Open and edit the ready-made JSON file
Open the ready-to-use template file located at:
```
birthday-photos.json
```
(Also available inside `public/assets/photos/photos_template.json`)

It has this exact format:
```json
[
  {
    "id": 1,
    "image": "photo1.jpg",
    "caption": "Our Favorite Beginning",
    "date": "14 Feb 2024",
    "note": "Every journey starts with a single step, and every memory with you is pure gold. 💫"
  },
  {
    "id": 2,
    "image": "photo2.jpg",
    "caption": "Sweet Moments & Laughter",
    "date": "Endless Smiles 😊",
    "note": "Remember this day? We laughed so hard our stomachs hurt! You always bring so much joy. 🌟"
  },
  {
    "id": 3,
    "image": "photo3.jpg",
    "caption": "Unforgettable Adventures",
    "date": "Pure Magic 🌿",
    "note": "Life with you is never dull. Here's to all the unplanned adventures and great stories. 🌈"
  }
]
```
- **`image`**: The filename of your photo (e.g. `"photo1.jpg"` or `"/assets/photos/photo1.jpg"`).
- **`caption`**: The title shown on the polaroid card.
- **`date`**: The date or occasion badge (e.g. `"14 Feb 2024"` or `"Summer Trip ☀️"`).
- **`note`**: Your personal memory note / message.

You can add as many photos as you want by copying and pasting a block!

---

### Step 3: Import into the Admin Dashboard
1. Open the Admin Panel at **[http://localhost:5173/admin](http://localhost:5173/admin)**.
2. Click the **"Memory Photos"** tab.
3. Click the purple **"Import Pictures JSON"** button and select your `birthday-photos.json` file.
4. Click **"Save Changes"** in the top right.
5. Click **"Preview"** to see your photos live in the surprise experience!

---

## 🚀 How to Run the Website

### Start Website:
Double-click `start.bat` or run:
```bash
npm run dev
```

- **Surprise Experience:** [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API:** [http://localhost:3001/api/birthday](http://localhost:3001/api/birthday)

---

## 📁 File & Folder Map
```
birthday-surprise/
├── birthday-photos.json       <-- Ready-to-use Picture Template
├── public/
│   └── assets/
│       ├── photos/            <-- PUT YOUR PICTURES HERE (.jpg / .png)
│       │   ├── photos_template.json
│       │   ├── photo1.svg
│       │   └── ...
│       ├── gifts/             <-- Gift box icons
│       ├── decorations/       <-- Cake, balloons, crown SVGs
│       └── music/             <-- Put birthday.mp3 here
├── server/
│   ├── server.js              <-- Express Backend API
│   └── data/
│       └── birthdayConfig.json
├── src/
│   ├── components/            <-- Surprise screens (Unlock, Celebration, Gallery, Gifts, Letter)
│   ├── pages/
│   │   ├── Home.jsx           <-- Main Surprise Flow
│   │   └── Admin.jsx          <-- Visual Admin Panel with JSON Import
│   └── config/
│       └── birthdayConfig.js
└── start.bat                  <-- One-click Windows starter
```
