# Cribl API Project

[![codecov](https://codecov.io/gh/tjeastmond/cribl/graph/badge.svg?token=19SODAW58R)](https://codecov.io/gh/tjeastmond/cribl)

> Thank you for taking the time to review this project. I am excited to share my work with you and look forward to your feedback!

This is an implementation of the Cribl team's API assessment project. This repo contains a simple API service for reading log files from the `/var/log` directory and returning the data in JSON format (when it works, otherwise an array or log lines). The service is built using Node.js, Express, and library free TypeScript for the reading and parsing of log files.

## A Few Notes

Starting with some simple notes about the project:

- I built the reader and parser working with log files containing content in formats similar to Apache status logs and Cloudwatch JSON logs.
- If the simple log format checks fail, the service will return an array of log lines.
- The project code was developed and run on Mac OS X using an M3 Pro Max.
- The code may be over documented! If you find it too verbose, please let me know.
- Due to time constraints, I did not implement any of the bonus features. I would be happy to discuss how I would implement them if you would like. I may submit a PR with a bonus feature or two while you are reviewing.

## Technologies and Libraries

While the primary logic of this project is written in `TypeScript` without the aid of any libraries, the server uses the following libraries:

- Express Server: Express, Nodemon
- Express Middleware: Helmet, Cors
- Testing: Jest, Supertest
- Code: Prettier (built into my IDE)

And uses the following technologies across the project:

- TypeScript
- Node.js
- Docker

### Authentication

I have implemented a simple authentication middleware that checks for a `Bearer` token in the `Authorization` header. If the token is not present or does not match, the service will return a `401` or `403` status code as appropriate.

All the sample `curl` calls with have a valid token in the `Authorization` header.

## Getting Started Locally

To get started with this project, you will need to have `Node.js v20.17.0` installed on your machine. I suggest using `NVM` to install the proper version of `Node.js`. Once you have cloned this repository you can run the following command:

```bash
# Install the project dependencies
npm install
```

For local development, you need to edit the `.env` file to point to your `/var/log` direcotry or feel free to point it to the `/src/app/reader/__test__/fixtures` directory to use the test log files. Either way, I would suggest copying the test files to you log directory.

Files in the `/var/log` directory are read and parsed by the service. To run the service, you can use the following command:

```bash
# Start the service locally
npm run dev
```

## Getting Started with Docker

The Docker Compose instance will install all of your dependencies, copy the test log files to its `/var/log` directory, and start the service. To get started with Docker, you can run the following command:

```bash
docker-compose up
```

## API Endpoints

The service has two endpoints:

- `GET /` - This endpoint will return a simple health check message
- `POST /logs` - This endpoint will return log data from the `/var/log` directory

### POST /logs

This endpoint requires a `POST` request with a bearer token, and the following parameters in the JSON body:

```json
{
  "file_name": "string", // required
  "num_results": "number", // default 100
  "keyword": ["string", "string"] // default []
}
```

Filtering the results by `keyword` is optional. If the `keyword` parameter is not provided, the service will return all the log lines up to the `num_results` limit. Filtering is also case insensitive, and matches any of the keywords provided (not strictly all).

## Running Tests

The project has a suite of tests that can be run using the following command:

```bash
# Run all the tests
npm run test

# Or to skip the server tests:
npm run test:reader
```

## CURL Examples

The following CURL examples can be used to interact with the service. I will also include my export from my API testing tool, [Yaak.app](https://yaak.app/).

### Simple Health Check

```bash
curl -X GET 'http://localhost:3000/'
```

### Basic Calls

```bash
# get 100 logs from file: 1000_apache.log
curl -X POST 'http://localhost:3000/logs' \
  --header 'Content-Type: application/json' \
  --data-raw $'{ "file_name": "1000_apache.log" }' \
  --header 'Authorization: Bearer 935989e5-8293-4fef-9982-54167a2c85a7'
```

```bash
# request without token (should return 401)
curl -X POST 'http://localhost:3000/logs' \
  --header 'Content-Type: application/json' \
  --data-raw $'{ "file_name": "1000_apache.log" }' \

# request with an invalid token (should return 401)
curl -X POST 'http://localhost:3000/logs' \
  --header 'Content-Type: application/json' \
  --data-raw $'{ "file_name": "1000_cw.log" }' \
  --header 'Authorization: Bearer thats-not-a-token-thats-a-token'

# request that returns a formatted JSON list of logs
curl -X POST 'http://localhost:3000/logs' \
  --header 'Content-Type: application/json' \
  --data-raw $'{ "file_name": "1000_cw.log" }' \
  --header 'Authorization: Bearer 935989e5-8293-4fef-9982-54167a2c85a7'

# request that returns a formatted Apache status list
curl -X POST 'http://localhost:3000/logs' \
  --header 'Content-Type: application/json' \
  --data-raw $'{ "file_name": "1000_apache.log" }' \
  --header 'Authorization: Bearer 935989e5-8293-4fef-9982-54167a2c85a7'

# request for an invalid file (should return 400)
curl -X POST 'http://localhost:3000/logs' \
--header 'Content-Type: application/json' \
--data-raw $'{ "file_name": "thats_not_a_file.log" }' \
--header 'Authorization: Bearer 935989e5-8293-4fef-9982-54167a2c85a7'

# request with keywords and a request for 500 results
curl -X POST 'http://localhost:3000/logs' \
  --header 'Content-Type: application/json' \
  --data-raw $'{
    "file_name": "1000_cw.log",
    "keywords": ["errordetails", "database"],
    "num_results": 500
  }' \
  --header 'Authorization: Bearer 935989e5-8293-4fef-9982-54167a2c85a7'
```
