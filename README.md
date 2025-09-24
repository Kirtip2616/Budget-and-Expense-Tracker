# 💰 Budget and Expense Tracker — Expense Ease
<p align="center">
  <img src="https://img.shields.io/badge/license-proprietary-red.svg" />
  <img src="https://img.shields.io/badge/status-completed-success.svg" />
  <img src="https://img.shields.io/badge/made%20with-Node.js-green.svg" />
  <img src="https://img.shields.io/badge/database-MySQL-orange.svg" />
</p>

A **web-based Budget and Expense Tracker** to simplify financial management, budgeting, expense tracking, and reporting for users. Includes a friendly UI, secure authentication, real-time updates, and insightful analytics for better financial control.

---
## 📖 Table of Contents
- [Introduction](#-introduction)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [License](#-license)
- [Contributions](#-contributions)
- [Usage](#-usage)
- [User Interface Design and Outputs](#-user-interface-design-and-outputs)
- [Author](#-author)

---
## 📌 Introduction
The **Budget and Expense Tracker** is a comprehensive web application designed to help users manage their finances efficiently. Developed as a BCA project, it addresses the need for a user-friendly tool to track expenses, set budgets, and generate reports. The system supports secure user authentication, real-time data updates, and visual analytics to promote better financial habits and decision-making.

This project was developed as part of the BCA VI Semester curriculum at K.L.E. Society’s P.C. Jabin Science College, Hubballi, and demonstrates the practical application of web development, database management, and real-time communication technologies.


---
## ✨ Features
- 🔐 Secure **authentication** (login/signup with bcrypt hashing)
- 🏦 **Budget creation and management**: Set monthly budgets, track progress, and receive alerts
- 📊 **Expense tracking**: Add, categorize, and monitor expenses with real-time updates
- 📈 **Reports and analytics**: Generate financial reports, charts (pie, bar, line), and summaries
- 📅 **Transaction history**: View, edit, or delete transactions with filters
- 💾 **MySQL database** for storing users, budgets, expenses, and transactions
- 📤 **Import/Export**: Support for CSV/PDF imports and report exports

---
## ⚙️ Tech Stack  
- **Frontend:** HTML, CSS, JavaScript, Chart.js  
- **Backend:** Node.js, Express.js, Socket.IO  
- **Database:** MySQL (MySQL Workbench)  
- **Version Control:** Git & GitHub  

---
## 🚀 Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/budget-expense-tracker.git
   cd budget-expense-tracker
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup database**
   - Create a MySQL database.
   - Import the schema from `/database/schema.sql`.
   - Create/update a `.env` file with database credentials and keys:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=changeme
     DB_NAME=bt_db
     PORT=3000
     EMAIL_HOST=smtp.example.com
     EMAIL_USER=your@email.com
     EMAIL_PASS=password
     ```
4. **Run the server**
   ```bash
   npm start
   ```
5. **Access the app**
   Open `http://localhost:3000` in your browser.

---
## 📜 License
- **This project is licensed under a Proprietary License.**
- Commercial or personal use without permission is prohibited.
See the full [LICENSE](LICENSE.md) file for details.

---
## 🤝 Contributions
Contributions are possible, but only with my prior approval.
If you have suggestions or would like to collaborate, please open an Issue to discuss your idea before submitting any changes.

---
## 🎮 Usage
- **Register/Login** as a user
- **Create budgets** and set categories
- **Track expenses** and add transactions
- **View reports** with charts and analytics
- **Import data** via CSV/PDF for bulk entries
- **Clear data** or export reports as needed

---
## 🖼️ User Interface Design and Outputs
- **🔐 Login Page**
  <img width="1916" height="906" alt="Image" src="https://github.com/user-attachments/assets/5b5bfc8f-38a6-4d72-9720-fced040869c0" />

- **🏠 Dashboard**
<img width="1897" height="976" alt="Image" src="https://github.com/user-attachments/assets/af57eef8-92bd-42e5-836f-5366f2a3d551" />

- **📋 Budgets Section**
<img width="1919" height="984" alt="Image" src="https://github.com/user-attachments/assets/6ad9fb55-5ff4-44b0-9b2e-44689057cd40" />

- **📋 Expenses Listings**
 <img width="1904" height="977" alt="Image" src="https://github.com/user-attachments/assets/0798766b-70ac-4129-b75d-871dbb1a4c91" />

- **📍 Transaction Details**
 <img width="1920" height="970" alt="Image" src="https://github.com/user-attachments/assets/fb40e7a8-1074-4809-a43f-d02850d6b389" />
 
- **📍 Import Transactions Page**
 <img width="1898" height="892" alt="Image" src="https://github.com/user-attachments/assets/aa1d215b-5ae9-4654-b0ab-39cad626de4e" />


---
## 👩‍💻 Author
- **Kirti Pawar**
- **EMAIL**: kirtivpawar26@gmail.com