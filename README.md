# 🛍️ InighoStore — E-Commerce Product Catalog & Cart

A **full-stack responsive e-commerce web application** built with **React.js** frontend and **Java Spring Boot REST API** backend, featuring product listing, search filtering, dynamic shopping cart via React state management, and MySQL/H2 database integration.

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## ✨ Features

### Frontend (React.js)
- **Responsive Product Grid** — CSS Grid with auto-fill for all screen sizes
- **Real-time Search** — Debounced search with instant filtering
- **Category Filtering** — Interactive pill-style category tabs
- **Price Range Filter** — Min/Max price filtering
- **Sorting** — By price (asc/desc), name, and rating
- **Dynamic Shopping Cart** — Slide-out drawer with React state management
- **Quantity Controls** — Increment/decrement with real-time subtotal
- **Dark/Light Mode** — Toggle with localStorage persistence
- **Toast Notifications** — Animated add-to-cart confirmations
- **Loading Skeletons** — Shimmer loading states
- **Micro-Animations** — Hover effects, transitions, animated orbs

### Backend (Java Spring Boot)
- **REST API** — Full CRUD endpoints for products and orders
- **JPA/Hibernate** — ORM with entity relationships
- **Database** — H2 in-memory (demo) / MySQL (production)
- **Search & Filter API** — Server-side search, category, price, and sort
- **Order Management** — POST checkout with order items
- **CORS Configuration** — Cross-origin setup for frontend communication
- **Data Seeding** — Auto-populated product catalog on startup

---

## 🏗️ Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite 5, Vanilla CSS      |
| Backend     | Java 17, Spring Boot 3.2           |
| Database    | MySQL 8.0 / H2 (in-memory)         |
| ORM         | Spring Data JPA / Hibernate         |
| API         | RESTful (JSON)                      |
| Icons       | Lucide React                        |
| Fonts       | Outfit, Plus Jakarta Sans           |

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (JDK)
- **Maven** (or use the Maven wrapper)
- **Node.js 18+** and **npm**

### 1. Start the Backend (Spring Boot)

```bash
# From the project root directory
mvn clean install
mvn spring-boot:run
```

The API server starts at `http://localhost:8080`

### 2. Start the Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The React app starts at `http://localhost:5173`

### 3. Open in Browser

Navigate to **http://localhost:5173** to see the full application.

> **Note:** The frontend works independently even without the backend running — it falls back to mock data automatically.

---

## 📡 API Endpoints

| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/api/products`         | List all products (with filters)|
| GET    | `/api/products/{id}`    | Get product by ID               |
| GET    | `/api/products/categories` | Get all categories           |
| POST   | `/api/orders`           | Create a new order (checkout)   |
| GET    | `/api/orders`           | List all orders                 |
| GET    | `/api/orders/{id}`      | Get order by ID                 |

### Query Parameters for `/api/products`
- `search` — Search by name/description
- `category` — Filter by category
- `sort` — `price-asc`, `price-desc`, `name`, `rating`
- `minPrice` / `maxPrice` — Price range filter

---

## 📁 Project Structure

```
E-Commerce_Product_Catalog_and_Cart/
├── pom.xml                          # Maven configuration
├── src/main/java/com/ecommerce/
│   ├── EcommerceApplication.java    # Spring Boot entry point
│   ├── config/
│   │   └── WebConfig.java           # CORS configuration
│   ├── model/
│   │   ├── Product.java             # Product entity
│   │   ├── Order.java               # Order entity
│   │   └── OrderItem.java           # Order item entity
│   ├── repository/
│   │   ├── ProductRepository.java   # Product JPA repository
│   │   └── OrderRepository.java     # Order JPA repository
│   └── controller/
│       ├── ProductController.java   # Product REST controller
│       └── OrderController.java     # Order REST controller
├── src/main/resources/
│   ├── application.properties       # App configuration
│   └── data.sql                     # Database seed data
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css                # Design system
        ├── App.jsx                  # Main application
        ├── App.css
        └── components/
            ├── Header.jsx / .css
            ├── ProductCatalog.jsx / .css
            ├── ProductCard.jsx / .css
            └── CartDrawer.jsx / .css
```

---

## 🎨 Design Highlights

- **Glassmorphism UI** — Frosted glass effect with backdrop-filter blur
- **HSL Color System** — Customizable design tokens via CSS variables
- **Dark/Light Themes** — Seamless toggle with smooth transitions
- **Animated Gradient Orbs** — Floating background elements
- **Micro-interactions** — Hover lifts, cart bounce, shimmer effects
- **Premium Typography** — Google Fonts (Outfit + Plus Jakarta Sans)
- **Responsive Grid** — Mobile-first with CSS Grid auto-fill

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
