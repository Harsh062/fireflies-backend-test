# Project Overview

## Project Structure & Reasoning

This project follows a modular structure to ensure **scalability, maintainability, and separation of concerns**:

- `controllers/`: Handles request validation and responses.
- `services/`: Contains business logic and interacts with repositories.
- `repos/`: Interfaces with the database, abstracting database operations.
- `db.ts`: Provides a common interface for database operations, improving reusability.
- `middlewares/`: Houses authentication and validation middleware.
- `schemas/`: Includes request validation using `Zod`.
- `utils/`: Contains helper functions and custom error handling classes.

This structure ensures **separation of concerns**, making it easier to extend and debug.

## Security Bug Identified & Fixed

- **Missing Authorization in Meeting APIs**: Initially, users could access meetings that didn’t belong to them. I fixed this by ensuring users can only fetch and update their own meetings.
- **Incorrect** `await` Usage in `server.ts`: The original implementation used `await` at the root level, preventing the server from starting correctly. I moved the async connection logic into an `async function` and properly started the Express server after MongoDB connects.

## Performance Optimizations

To ensure the API scales well with increasing data, I implemented the following optimizations:

1. **Pagination & Sorting**: Added `limit` and `skip` to avoid fetching large datasets at once.
2. **Optimized Meeting Stats**: Aggregated statistics per user instead of global aggregation, reducing query complexity.
3. **Indexes on Commonly Queried Fields**: Indexed `userId` and `date` fields to speed up database queries.
4. **Batch Processing for AI Tasks**: Summarization and tagging are processed asynchronously, improving API responsiveness.

## AI-Powered Auto-Tagging Feature (Bonus)

As a bonus, I implemented **AI-powered meeting categorization**. Based on the transcript content, meetings are automatically tagged under categories like `Project Discussion`, `Client Call`, `Team Standup`, etc. This allows users to filter meetings efficiently.

## FYI

- **All APIs operate on a per-user level**: Users only access and manage their own meetings.
- **Designed with Future Scalability in Mind**: The modular design ensures easy adaptation for new features and integrations.

---

For further details, check out the [README](https://chatgpt.com/c/README.md).
