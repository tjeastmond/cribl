# Cribl API Project

[![codecov](https://codecov.io/gh/tjeastmond/cribl/graph/badge.svg?token=19SODAW58R)](https://codecov.io/gh/tjeastmond/cribl)

> Thank you for taking the time to review this project. I am excited to share my work with you and look forward to your feedback!

This is an implementation of the Cribl team's API assessment project. This repo contains a simple API service for reading log files from the `/var/log` directory and returning the data parsed for use. The service is built using Node.js, Express, and library free TypeScript for the reading and parsing of log files.

## Notes

A few points about the project:

- I built the reader and parser working with log files containing content in formats similar to Apache status logs and Cloudwatch JSON logs.
- If the simple log format checks fail, the service will return an array of log lines.
- The project code was developed and run on Mac OS X using an M3 Pro Max.
- The code may be over documented! If you find it too verbose, please let me know.
- Due to time constraints, I did not implement any of the bonus features. I would be happy to discuss how I would implement them if you would like. I may submit a PR with a bonus feature or two while you are reviewing.

**What I Want to Add**

- I was planning on implementing `gRPC` for the service to communicate with other servers hosting this service
- I want to add paging, but I'd want to add caching as well to make it more efficient

## Technologies and Libraries

While the primary logic of this project is written in `TypeScript` without the aid of any libraries, the server uses the following libraries:

- Express Server: Express, Nodemon
- Express Middleware: Helmet, Cors
- Testing: Jest, Supertest
- Code: Prettier (built into my IDE)

And uses the following technologies across the project:

- TypeScript
- Node.js
- Jest
- Docker

### Code Decisions

**Log Reading**

This project reads logs via file streams, and approaches pulling data from the files in two different ways.

Both approaches only read in a chunk of data at a time and steps through the buffer backwards looking for lines that satisfy filtering and the requqired number of results needed. We seek backwards to ensure that the newest lines are returned first. The function running this process opperates like a generator, yielding and waiting for the next chunk of data to be requested.

My first solution would take the buffer and split it on new lines and steps through them backwards looking for viable log lines. It filters and only returns the number of results requested. This solution is more memory intensive, but is more readable and easier to follow.

The second solution that I kept in place is more memory efficient, but potentionally harder to follow. It leaves the buffer in tact, looks for the last new line character and then plucks out the last line. Eventually the buffer will empty and need a new chunk of data, unless we have all we need.

I left a toggle in place to switch between both solutions if you are interested, and could be found in the `src/app/reader/search.ts` file.

**Parsing Logs**

I wanted to make sure that the logs get to the endpoint in a useable format. I wrote an abstract base class that both current parsers implement. The idea is to make it so additional parsers could be easily added and used in the future. I was also thinking the API caller could request a specific parser to be used, but I haven't implement that feature yet.

The parsers use simple logic to determine if they are the best solution for the log file. If no parser works, the log is returned as an array of log lines.

### Authentication

I have implemented a simple authentication middleware that checks for a `Bearer` token in the `Authorization` header. If the token is not present or does not match, the service will return a `401` or `403` respectively.

All the example `curl` calls at the end of this README have a valid token in the `Authorization` header. You could find available tokens in the `src/config/validTokens.ts` file.

## Getting Started Locally

To get started with this project, you will need to have `Node.js v20.17.0` installed on your machine. I suggest using `NVM` to install the proper version of `Node.js`. Once you have cloned this repository run the following command to get started:

```bash
npm install
```

For local development, there is an `npm` script that will copy the test log files to the `/var/log` directory. This is just a convient way to test the service locally. You don't need my logs!

Files in the `/var/log` directory are read and parsed by the service. To run the service, you can use the following command:

```bash
npm run dev

# or

npm start
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
  "file_name": "string",
  "num_results": "number",
  "keywords": ["string", "string"]
}
```

- **file_name:** required, the name of the log file to read
- **num_results:** optional, the number of results to return, defaults to 100
- **keywords:** optional, an array of keywords to filter the results by, defaults to []

Filtering the results by `keywords` is optional. If the `keywords` parameter is not provided, the service will return all the log lines up to the `num_results` limit. Filtering is also case insensitive, and matches any of the keywords provided (not strictly all).

## Running Tests

The project has a suite of tests that can be run using the following commands:

```bash
# Run all the tests
npm run test

# Or to skip the server tests:
npm run test:reader
```

## CURL Examples

The following CURL examples can be used to interact with the service. I will also include my export from the API testing tool, [Yaak.app](https://yaak.app/).

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
