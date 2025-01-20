# Health Clinic Appointment System

## Overview
The Health Clinic Appointment System is a user-friendly web application designed to streamline the appointment booking process for health clinics. It allows patients to book, reschedule, or cancel appointments, while enabling clinic staff to manage schedules efficiently. This system is built with scalability and ease of use in mind, aiming to improve the overall patient experience and administrative workflow.

## Features
- **Patient Portal:**
  - Register and log in.
  - View available appointment slots.
  - Book, reschedule, or cancel appointments.
  
- **Clinic Doctor Portal:**
  - Manage appointment schedules.
  - Add, update, or delete time slots.
  - View patient appointment.

  - **Admin Portal:**
  - Monitor the Doctor Activity.
  - View patient appointment.

- **Filter:**
  - Filter available slots by date and time.

## Technologies Used
- **Frontend:** React.js with Material-UI for a responsive user interface.
- **Backend:** Node.js with Express for handling API requests.
- **Database:** MySQL (XAMPP) for storing user and appointment data.
- **Authentication:** JSON Web Tokens (JWT) for secure authentication.

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Adrian-Suson/Apointment_System.git
   ```

2. Navigate to the project directory:
   ```bash
   cd appointment-system
   ```

3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

4. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```
5. Install dependencies for the client:
  ```bash
   cd client
   npm install
   ```

6. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     # Server Configuration
     PORT=8000
     HOST='localhost'
     
     # JWT Configuration
     JWT_SECRET='Your_jwt_secret'
     
     # Database Configuration
     DB_HOST='localhost'
     DB_USER='root'
     DB_PASSWORD=''
     DB_NAME='hams'
     ```

6. Start the application:
   - Backend:
     ```bash
     cd backend
     npm start
     ```
   - Frontend:
     ```bash
     cd frontend
     npm start
     ```
     - Client:
     ```bash
     cd client
     npm start
     ```


## Usage
1. Register as a patient or log in as a Doctor.
2. Navigate to the dashboard to view or manage appointments.
3. Use the patient portal to book appointments.
4. Clinic Doctor can manage time slots and view User history.

## Contributing
We welcome contributions to improve this project! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.


## Acknowledgments
- [React.js](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/)

