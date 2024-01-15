# Veda Booking System

Veda Booking System is a simple boat booking application that allows users to view and request boat reservations. The system includes two types of users: admin and regular users. Admins have the ability to interact with the calendar, including adding, updating, and canceling requests, while regular users can only view boat reservation information.

## Getting Started

Follow these steps to set up and run the Veda Booking System:

### Prerequisites

- Node.js and npm installed
- PostgreSQL database with the specified credentials
- Vue.js and Yarn installed (for the client)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/codescalersinternships/Veda_booking_calendar
    ```

2. Change into the project directory:

    ```bash
    cd veda-booking-system
    ```

3. Install dependencies for both the server and client:

    ```bash
    cd server
    yarn install

    cd ../client
    yarn install
    ```

4. Create a `.env` file in the `server` directory with the specified environment variables.

### Running the Application

Use the provided Makefile to easily run the server or client:

- To run the server:

    ```bash
    make runserver
    ```

- To run the client:

    ```bash
    make runclient
    ```

### Linting

Linting can be performed for both the server and client using the following commands:

- Server linting:

    ```bash
    make lintserver
    ```

- Client linting:

    ```bash
    make lintclient
    ```

### Docker Build

Linting can be performed for both the server and client using the following commands:

- Server:

    ```bash
    make buildserver
    ```

- Client:

    ```bash
    make buildclient VEDA_SERVER_DOMAIN=<your_server_domain> isProd=false # Your environment can be true or false depending on your choice.
    ```
