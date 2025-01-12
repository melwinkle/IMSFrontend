# ABC Health Information Management System

## Overview

The ABC Health Information Management System (HIMS) is a web application designed to facilitate the management of health-related data, including patient diagnoses, user authentication, billing, and image uploads. The application provides a user-friendly interface for healthcare professionals to manage patient information, track diagnoses, handle billing, and manage related images efficiently.

## Technologies Used

- **Frontend**: 
  - **React**: A JavaScript library for building user interfaces.
  - **TypeScript**: A superset of JavaScript that adds static typing, enhancing code quality and maintainability.
  - **Redux Toolkit**: A state management library for managing application state in a predictable way.
  - **Axios**: A promise-based HTTP client for making API requests.

- **Backend**: 
  - **Django**: A high-level Python web framework that encourages rapid development and clean, pragmatic design.
  - **Django REST Framework**: A powerful toolkit for building Web APIs in Django.

- **Database**: 
  - **PostgreSQL**: An open-source relational database management system.

## Major Functionalities

### User Authentication
- **Registration**: Users can register with their email, name, and role (e.g., patient, doctor, admin).
- **Login/Logout**: Users can log in to access their dashboard and log out when finished.
- **Profile Management**: Users can view and update their profile information.

### Patient Management
- **Diagnosis Management**: Healthcare professionals can create, view, edit, and archive patient diagnoses.
- **Image Management**: 
  - **Radiologists** can upload scans related to patient diagnoses.
  - **Doctors** can refer to these images when adding to their diagnoses.
  - **Patients** can view their related images, enhancing their understanding of their medical conditions.

### Billing Service
- **Invoice Management**: 
  - **Billing Staff** can create and manage invoices related to patient services.
  - **Patients** can view their invoices and billing history, ensuring transparency in billing processes.

### Dashboard
- **User Dashboard**: Different user roles (admin, doctor, patient, etc.) have customized dashboards displaying relevant statistics and recent activities.
- **Statistics**: The dashboard provides insights into the total number of users, patients, diagnoses, and other relevant metrics.


### Major Roles
1. **Admin**: Manages user accounts and oversees the overall system functionality.
2. **Doctor**: Creates and manages patient diagnoses, refers to images, and interacts with patient data.
3. **Radiologist**: Uploads and manages medical scans, ensuring that doctors have access to necessary imaging for diagnoses.
4. **Billing Staff**: Creates and manages invoices, ensuring accurate billing for services rendered to patients.
5. **Medical Staff**: Responsible for creating and managing patient records, ensuring that patient information is up-to-date and accurate.
6. **Patient**: Views their diagnoses, related images, and billing information, facilitating better engagement with their healthcare.

### Responsive Design
- The application is designed to be responsive, ensuring a seamless experience across various devices, including desktops, tablets, and mobile phones.

## Installation

1. Clone the repository:
   ```bash
   cd abchealthims
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Ensure the backend server is running (Django) and the database is set up.

## Running the Backend with Docker

1. Navigate to the backend folder:
   ```bash
   cd imsbackend
   ```

2. Build and run the Docker container:
   ```bash
   docker compose up --build
   ```

3. Create a superuser to access the admin interface:
   ```bash
   docker compose run web python manage.py createsuperuser
   ```

4. Follow the prompts to set up the superuser account.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community for the libraries and tools that made this project possible.
