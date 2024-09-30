# CURL Examples

This file is a simple example of how to use CURL to interact with the API.

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

---

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
