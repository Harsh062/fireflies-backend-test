# MeetingBot API

MeetingBot API is a service designed to manage meetings, tasks, and AI-powered summaries efficiently. It provides a robust backend with MongoDB as a database and leverages containerization via Docker. Users can create, update, and retrieve meetings while the AI service generates summaries and action items based on meeting transcripts.

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Running Tests](#running-tests)
- [Seeding the Database](#seeding-the-database)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)

---

## **Technologies**

This project is built using:

- **Node.js** - Backend runtime
- **Express.js** - Web framework for building RESTful APIs
- **MongoDB** - NoSQL database for storing meetings and tasks
- **Zod** - Input validation for API requests
- **Jest** - Unit testing framework
- **Typescript** - Strongly typed JavaScript
- **Docker** - Containerization for easy deployment
- **Docker Compose** - Orchestrates multiple containers (MongoDB, API)
- **AI Service (Mock)** - Generates meeting summaries, action items and category based on transcripts

---

## **Features**

- **Meeting Management** - Create, retrieve, update, and delete meetings.
- **Task Management** - Tasks are automatically generated from AI-generated action items.
- **AI-Powered Summarization** - Automatically generates meeting summaries and action items.
- **Auto-Tagging** - Meetings are categorized based on AI analysis.
- **User-Based Meeting Statistics** - Users get personalized meeting analytics.
- **Pagination & Sorting** - Optimized fetching of meetings with pagination and sorting.
- **Input Validation** - All request bodies are validated using Zod.
- **Error Handling** - Centralized error handling for consistent API responses.

---

## **Installation**

### **1\. Clone the Repository**

```bash
git clone <your-repository-url>
cd meetingbot-api
```

### **2\. Ensure You Have Docker Installed**

Ensure **Docker** and **Docker Compose** are installed on your system.

### **3\. Run the Application Using Docker**

```bash
docker-compose up --build
```

This will start:

- The **MongoDB** database
- The **Node.js API server**

### **4\. Verify the API is Running**

Once the services are up, you can access the API at:

```javascript
http://localhost:3000
```

---

## **Configuration**

Create a `.env` file in the project root and set the environment variables:

```javascript
MONGODB_URI=mongodb://mongo:27017/meetingbot
PORT=3000
```

- `MONGODB_URI` connects to the MongoDB instance inside the Docker container.
- `PORT` sets the API port (default `3000`).

---

## **Running the Project**

Once the project is running via `docker-compose`, API requests can be made using **Postman** or `curl`.

### **To Stop the Project**

```bash
docker-compose down
```

---

## **Running Tests**

To execute the unit tests:

```bash
docker-compose exec app npm run test
```

- Tests are written using **Jest**.
- The test suite covers files in services folder

---

## **Seeding the Database**

To populate the database with test data:

```bash
docker-compose exec app npm run seed
```

This will add:

- **Sample Meetings**
- **Sample Tasks**
- **Pre-populated Users**

---

## **API Endpoints**

### **Meetings**

| Method | Endpoint                       | Description                           |
| ------ | ------------------------------ | ------------------------------------- |
| `GET`  | `/api/meetings`                | Get all meetings (paginated & sorted) |
| `GET`  | `/api/meetings/:id`            | Get a single meeting by its ID        |
| `POST` | `/api/meetings`                | Create a new meeting                  |
| `PUT`  | `/api/meetings/:id/transcript` | Update the transcript of a meeting    |
| `POST` | `/api/meetings/:id/summarize`  | Generate summary & action items (AI)  |

### **Dashboard**

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| `GET`  | `/api/dashboard` | Get user-specific meeting statistics |

---

## **Error Handling**

The API uses a centralized error-handling approach. All errors return a consistent JSON response.

### **Example Error Response**

```json
{
  "message": "Meeting not found"
}
```

### **Common Errors**

| Status Code                 | Error Description                            |
| --------------------------- | -------------------------------------------- |
| `400` Bad Request           | Validation failed, request body is incorrect |
| `401` Unauthorized          | User is not authenticated                    |
| `403` Forbidden             | User does not have permission                |
| `404` Not Found             | Resource does not exist                      |
| `500` Internal Server Error | Unexpected server error                      |

---

## **Scalability Considerations**

- **Optimized MongoDB Queries** - Queries use indexing and filtering for performance.
- **Pagination & Sorting** - Prevents excessive database load.
- **Dockerized Deployment** - Easily scalable across multiple containers.
- **AI Processing Optimization** - Future improvements can offload AI processing to a dedicated microservice.

---

## **Conclusion**

This project provides a robust **meeting and task management API** with **AI-powered features**. The application is containerized with **Docker**, tested using **Jest**, and ensures **scalability** with **MongoDB optimizations**.

---
