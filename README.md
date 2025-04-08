# 🧮 Networth Tracker API

A secure and modular **RESTful API** built using **Hapi.js** to manage user data with strong encryption, validation, and authentication support.

---

## 🚀 Features

- ✅ User registration with encrypted SSN (PII)
- 🔐 Password hashing using `bcryptjs`
- 📄 Input validation via `Joi`
- 🧪 Unit & integration tests using `Jest`
- 🛠️ Modular folder structure with controller, route, and validation layers
- 🐳 Dockerized for easy deployment

---

## 🧰 Tech Stack

- **Node.js**
- **Hapi.js**
- **MongoDB** with **Mongoose**
- **Joi** (schema validation)
- **Crypto** (PII encryption)
- **JWT** for authentication (if added)
- **Jest** (testing)
- **Docker**

---

## 📦 Getting Started

### 🧑‍💻 Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud like Atlas)
- Docker (optional for containerization)
- `.env` file with the following keys:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/networth
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-32-byte-encryption-key
```

---

### 🔧 Installation

```bash
# Clone the repository
git clone <repo-url>
cd networth-assignment

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🧪 Running Tests

```bash
npm run test
```

Jest is used to test core functionality like:

- User creation
- Login
- Validation failures
- Authenticated routes

---

## 📬 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| POST   | `/api/users` | Register a new user |
| POST   | `/api/login` | Authenticate a user |

### 👥 User Routes

| Method | Endpoint     | Description           | Auth Required |
| ------ | ------------ | --------------------- | ------------- |
| GET    | `/api/users` | Get list of all users | ✅            |

---

## 📁 Folder Structure

```
networth-tracker-backend/
├── src/
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Hapi routes
│   ├── validators/        # Joi schemas
│   ├── utils/             # Encryption/hash helpers
│   └── createServer.js    # test server config
│   └── server.js          # Hapi server config
├── tests/                 # Jest test cases
├── .env
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 🐳 Docker Support

```bash
# Build and start the container
docker-compose up --build

# Stop the container
docker-compose down
```

## 📃 License

This project is licensed under the MIT License.
