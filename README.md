# 🎬 movieVerse ![App Preview](frontend/public/logo_black.png)

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
nodemon src/index.js
```

Backend runs at: [http://localhost:5000](http://localhost:5000)

---

## 🔧 Core Features

### 🎞️ Movie Module

* Fetches movie data using TMDB API
* View detailed movie info (title, description, actors, genres)
* Watch trailers via embedded YouTube links

### ❤️ Likes

* Like or unlike movies
* Track and update like counts

### 📌 Watchlist

* Add favorite movies to a personal watchlist
* Remove items from the watchlist
* Access saved movies via the profile page

### 🔐 Authentication

* JWT-based user registration and login
* Secure protected routes for personal features

### 📬 Email Integration

* Mailgun support for notifications and alerts

---

## 📦 Tech Stack

### Frontend

* React
* Vite
* Axios

### Backend

* Node.js
* Express
* CORS
* Nodemon
* Express Rate Limit
* Mailgun.js
* Form-data
* JSON Web Token (JWT)
* MongoDB (via Mongoose if implemented)

---

## 🛠 Future Improvements

* Add movie review and rating features
* Implement OAuth login (Google, Facebook)
* UI/UX polishing with animations and transitions
* Deployment to Vercel (frontend) and Render/Heroku (backend)

---

## 🧑‍💻 Author

Developed by [Ham Zhi Wei (HamZhiWei33)](https://github.com/HamZhiWei33)

---

## 📄 License

This project is licensed under the MIT License.

```

---

Let me know if you'd like to include:
- Screenshots or GIFs
- API endpoint documentation
- Contribution or code of conduct sections

I’d be happy to add those too!
```
