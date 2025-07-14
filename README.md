# ⚖️ LawConnect

**LawConnect** is a full-stack web application designed to modernize how legal professionals and law firms manage their daily operations. From client communication and scheduling to case tracking and fee management, LawConnect unifies all key legal workflows into one intuitive system.

## 🌐 Live Demo & Repository

* **Live Demo:** [LawConnect](https://law-connect-two.vercel.app)
* **GitHub Repository:** [GitHub](https://github.com/johnbekele/LawConnect.git)

> **Test Login:**
>
> * Email: `test@gmail.com`
> * Password: `668911`
>   *Note: Backend is hosted on Render for cost efficiency — it may be slow for testing but runs locally without interruption.*

---

## 🔐 Authentication & Security

* JWT-based authentication with **Passport.js**
* OTP login via **Twilio** & **Google NodeMailer**
* Role-based access control (**Client**, **Lawyer**, **Admin**)
* Protected routes on both frontend & backend
* Secure file uploads with role-based access

---

## 🧑‍💼 User Roles & Features

### 👥 Client

* Book appointments 📅
* Upload & view documents 📂
* Chat with lawyers 💬
* Track case status 📝

### 👨‍⚖️ Lawyer

* Manage appointments 📆
* Upload case notes & fee logs 🗂
* Chat with clients 🗨️
* Track milestones 📋

### 🛡️ Admin

* Manage all users 👥
* View platform analytics 📊
* Oversee cases and invoices 📑

---

## ⚙️ Tech Stack

| Layer        | Technology                         |
| ------------ | ---------------------------------- |
| 🎨 Frontend  | React.js, Next.js                  |
| ⚙️ Backend   | Node.js, Express.js                |
| 🗄️ Database | MongoDB                            |
| 🔐 Auth      | JWT, Passport.js                   |
| 💬 Chat      | Socket.io                          |
| ☁️ Hosting   | Vercel (Frontend), AWS EC2/Railway |

---

## 🧩 Key Features

* 🏠 Dashboard with real-time legal news & upcoming hearings
* 👤 Detailed client management
* 📁 Comprehensive case handling & milestone tracking
* 🗓️ Calendar-based hearing scheduler
* 💳 Fee logs for total & pending payments
* 📊 Analytics & activity profiles
* 📂 Secure document sharing
* 💬 Real-time chat with Socket.io
* 🔔 Notifications for appointments & updates
* 🛠️ Admin panel for user & content management

---

## 📑 API Routes

### 🔐 Auth Routes (`/api/auth`)

* `POST /register` — Register user with OTP
* `POST /login` — Login with credentials
* `POST /logout` — Logout session
* `POST /advocate` — Send OTP via Twilio
* `POST /verifyotp` — Verify OTP
* `POST /existing` — Check if user exists
* `GET /verify-token` — Verify session token
* `POST /reset-password` — Reset password

### 👤 User Routes (`/api/users`)

* `GET /profile` — Fetch user profile
* `PUT /updateProfile` — Update profile (with image)
* `DELETE /deleteadv/:email` — Delete user
* `GET /toknow` — Get all users (debug)

### 📁 Case Routes (`/api/cases`)

* `GET /getcases` — Get all cases
* `POST /createcase` — Create new case
* `PUT /updatecase/:case_ref_no` — Update case
* `DELETE /deletecase/:case_ref_no` — Delete case
* `GET /casesinfo` — Detailed case info
* `GET /pendingcases` — View pending cases

### 👥 Client Routes (`/api/clients`)

* `GET /clients` — Get all clients
* `GET /clients/:case_ref_no` — Get client by case
* `POST /createclient` — Create new client

### 💰 Fee Routes (`/api/fees`)

* `GET /getfees` — Get all fees
* `POST /createfee` — Create new fee
* `PUT /updatefee/:id` — Update fee
* `DELETE /deletefee/:id` — Delete fee

### 📅 Hearing Routes (`/api/hearings`)

* `GET /hearings` — Get all hearings

### 📂 Upload Routes (`/api/upload`)

* `PUT /updateProfile` — Upload profile picture

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/a2fbb72c-0435-473a-ae43-19a70e25905f) 



![image](https://github.com/user-attachments/assets/c430f6ad-dba7-4385-a77f-3576d8d11082) ![image](https://github.com/user-attachments/assets/dd4c85b5-6993-4184-8247-b83d0bb5fd8b)



![image](https://github.com/user-attachments/assets/a71d7dd4-c03c-4633-b862-6e87faa58bdb) ![image](https://github.com/user-attachments/assets/3d570d1a-044b-426e-a758-4bad79b259fc)



![image](https://github.com/user-attachments/assets/ba4d652b-d8fb-43b9-90e2-9aa02dcb30c8)
![image](https://github.com/user-attachments/assets/9013ea2f-3492-4810-9d92-06b903bb0d9b)
![image](https://github.com/user-attachments/assets/11b905a7-795b-4b78-a67b-7f57a33a10d4)

![image](https://github.com/user-attachments/assets/27a9078d-5b78-4197-8288-db63a171c567)

![image](https://github.com/user-attachments/assets/f2e26d46-03fe-4d26-ae9b-1c5a69050092)

![image](https://github.com/user-attachments/assets/e799b0d6-bba4-4b8c-97a3-55bb3867da7a)


**Developed by:** [John Bekele](https://github.com/johnbekele)

---


---
## 🙋‍♂️ Author

Made with 💙 by [Yohans Bekele](https://github.com/johnbekele)
