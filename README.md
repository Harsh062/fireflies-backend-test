# MeetingBot API

MeetingBot API is a backend service for **managing meetings and tasks** with **AI-powered summarization and tagging**. The API provides efficient meeting organization, task generation, and optimized query performance through caching and indexing.

## Table of Contents

- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Running Tests](#running-tests)
- [Database Seeding](#database-seeding)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Libraries used](#tech-stack)

## Features

- APIs to Create, update, and retrieve **meetings**.
- Automatically generate **tasks** based on meeting summaries.
- **AI powered** summaries, action items and tagging from transcripts
- Caching and indexing for better scalability.
- Users can only access their own meetings, tasks and dashboard data.

## Setup & Installation

### 1\. Clone the Repository

```bash
git clone git@github.com:Harsh062/fireflies-backend-test.git
cd fireflies-backend-test
```

### 2\. Run the Application with Docker

Ensure **Docker** and **Docker Compose** are installed. Then, start the application:

```bash
docker-compose up --build
```

This will start the backend service along with MongoDB and **automatically seed the database.**

### 3\. Access the API

Once the services are up, access the API at:

```javascript
http://localhost:3000
```

## Configuration

Create a `.env` file in the project root:

```javascript
MONGODB_URI=mongodb://mongo:27017/meetingbot
PORT=3000
```

## Running the Project

To start the project:

```bash
docker-compose up --build
```

To stop it:

```bash
docker-compose down
```

## Running Tests

To execute unit tests:

```bash
docker-compose exec app npm run test
```

## API Endpoints

### Meetings

- `GET /api/meetings` – Fetch paginated meetings (sorted by date).
- `GET /api/meetings/:id` – Retrieve a meeting by ID (only if the user owns it).
- `POST /api/meetings` – Create a new meeting.
- `PUT /api/meetings/:id/transcript` – Update the transcript of a meeting.
- `PUT /api/meetings/:id/summarize` – Generate AI-powered summaries, action items, and category.

### Dashboard

- `GET /api/dashboard` – Get a summary of user meetings and tasks.

**Refer to the postman collection for more details.**

## Error Handling

All errors are standardized and return JSON responses:

```json
{
  "message": "Unauthorized access"
}
```

## Libraries used

- **Zod** is used for schema validation for API requests.
- **Jest** is used for writing unit testing cases.
- **node-cache** is used for caching for improving response time for meeting stats API

### Common Error Codes

- **400** – Bad Request (Validation error)
- **401** – Unauthorized (Missing/invalid authentication)
- **404** – Not Found (Resource does not exist)
- **500** – Internal Server Error (Unexpected issues)

For additional details on project structure, optimizations, and security fixes, refer to [Project Overview](https://github.com/Harsh062/fireflies-backend-test/blob/master/project-overview.md).
