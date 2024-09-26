# Cribl API Project

This project is an implementation of the Cribl team's API project. The goal of the project is to accept requests to an API that will then fetch the log data requested. This data is serverd in reverse chronological order, as JSON, and is paginated. The requestor can also filter the results and specify the number of results per page.

## Assumptions

There are a few assumptions that I am making about the data that I will be working with. These assumptions are as follows:

1. The data will be in the form of JSON, and standard Apache log files.
2. The project code will be devloped in a Unix-like environment.
3. Code should be well documented.
4. Given time, running additional servers will rely on Docker.

## Technologies and Libraries

While the primary logic of this project is written in `TypeScript` without the aid of any libraries, the server uses the following libraries:

- Express: A Node.js web application framework
- Jest: A testing framework
- Supertest: A library for testing HTTP requests
- Nodemon: A utility that monitors for changes in code and automatically restarts the server
- Prettier: A code formatter (built into the IDE, Zed)
- Morgan: A logging library
- Helmet: A security library
- Cors: A library for enabling CORS

And uses the following technologies:

- TypeScript: A superset of JavaScript
- Node.js: A JavaScript runtime
- Docker: For containerization
