# 🏥 MediCore Hospital Management System (HMS)

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-red?style=for-the-badge&logo=python&logoColor=white)

**A modern, full-stack enterprise healthcare platform featuring role-based portals, real-time appointment scheduling, and interactive 3D UI visualizations.**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**MediCore HMS** is a state-of-the-art web application designed to bridge the gap between patient healthcare accessibility and hospital administration. Built with a high-performance **FastAPI** asynchronous backend and an ultra-responsive **React + Vite** frontend, the system delivers an intuitive user experience powered by **Three.js** 3D WebGL graphics and robust relational data management via **MySQL & SQLAlchemy**.

---

## ✨ Key Features

### 🔐 Multi-Role Access Control & Dedicated Portals
* **👑 Admin Dashboard:** Monitor live hospital statistics (doctor counts, appointment tracking), manage patient records, and handle doctor onboarding/approval workflows.
* **🩺 Doctor Portal:** Secure authentication for medical staff to review patient problem descriptions, assign consultation time slots, and update appointment statuses in real time.
* **🤒 Patient Portal:** Self-service onboarding allowing patients to register health profiles, book appointments with preferred doctors, and track consultation statuses (*Pending* / *Accepted*).

### 🎨 Premium 3D UI & Interactive Aesthetics
* **WebGL 3D Animations:** Built-in custom **Three.js** canvas featuring multi-axis rotating geometric meshes (cubes, spheres, toruses) and an interactive 100-particle kinetic collision system.
* **Modern Design System:** Crafted with responsive CSS grids, glassmorphism, dynamic hover effects, and smooth micro-animations.

### ⚡ Robust Backend & Data Integrity
* **Asynchronous REST API:** Clean separation of concerns with modular routing (`/auth`, `/patients`, `/doctors`, `/appointments`).
* **Transactional ORM:** Leverages **SQLAlchemy** with MySQL connection pooling and automated cascading deletions (e.g., deleting a patient automatically cleans up associated appointments).
* **Automated Swagger UI:** Built-in OpenAPI documentation for seamless frontend-backend integration and API testing.

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Backend Framework** | [FastAPI](https://fastapi.tiangolo.com/) (Python 3), Uvicorn ASGI Server |
| **Database & ORM** | MySQL, [SQLAlchemy](https://www.sqlalchemy.org/), PyMySQL, Pydantic |
| **Frontend Framework** | [React 18](https://react.dev/), [Vite](https://vitejs.dev/) |
| **3D Graphics & Rendering** | [Three.js](https://threejs.org/) (WebGL) |
| **Styling & UI** | Vanilla CSS (Custom Tokens, Glassmorphism, Responsive Flex/Grid) |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### 📋 Prerequisites
* **Node.js** (v18 or higher) & **npm**
* **Python** (v3.8 or higher)
* **MySQL Server** running locally or remotely

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername
