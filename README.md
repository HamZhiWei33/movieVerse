# 🎬 movieVerse 
## ![App Preview](frontend/public/logo_black.png)

**movieVerse** is a full-stack movie discovery web application that allows users to explore trending films, save favorites to a watchlist, and like movies. It features user authentication, external movie data integration using TMDB, and email support via Mailgun.

---

## 📁 Project Structure

```

movieVerse/
├── frontend/     # React + Vite frontend
└── backend/      # Express.js backend

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:HamZhiWei33/movieVerse.git
cd movieVerse
````

---

### 2. Frontend Setup (Vite + React)

```bash
cd frontend
npm install
npm install --save-dev vite
npm run dev
```

Frontend runs at: [http://localhost:5173](http://localhost:5173)

---

### 3. Backend Setup (Express.js)

```bash
cd backend
npm install
npm install --save-dev nodemon
npm install cors
npm install express-rate-limit
npm install axios
npm install mailgun.js form-data
```

#### Create `.env` file in the `backend` folder

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=mysecretkey
NODE_ENV=development
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

#### Start the backend server

```bash
npm run dev
```

Backend runs at: [http://localhost:5000](http://localhost:5000)

---

## Core Features

### User Registration & Authentication

* Secure user sign-up and login with JWT.
* User access control to personalized content.
* Data stored securely in MongoDB.

### Likes

* Like or unlike movies
* Track and update like counts

### Profile Management

* View and edit profile details including username, password, gender, and profile picture.
* Visualized insights with donut charts: genre preference, ratings, watchlist stats.

### Top Entertainment Charts

* Highlight top-ranked and trending movies.
* Genre-based movie categorization.

### Search & Personalized Recommendations

* Personalized movie recommendations based on user favourite genre selection or random picks if not logged in.
* Key word search by title

### Movie Module

* View detailed movie info: title, synopsis, genres, trailer.
* Like/unlike movies with real-time like count.
* Add/remove movies from watchlist.

### User Ratings & Reviews

* Rate movies from 1 to 5 stars.
* Write and read community reviews to support shared decision-making and engagement.


---

## 📦 Tech Stack

MERN Stack
