# Job Tracker API Documentation

NOTE: When running on local host, the port variable will fall back to 9000 if process.env.PORT is undefined.

## USER

### Register
**POST**  ```/api/v1/user/register```

- Returns the newly created user as the body of the response.
- If request body is missing any required fields, responds with a status code 400 and message: ```{"msg": "Please provide email, password, and name."}```.

| Field        | Data Type | Required? | Notes                           |
| ------------ | --------- | --------- | ------------------------------- |
| email        | string    | Yes       | Must be a valid email address.  |
| password     | string    | Yes       | Restraints: 6 character minimum |
| display_name | string    | Yes       | Restraints: 2 - 50 characters   |

#### Request Body
``` json
{
    "email": "marysue@email.com",
    "password": "asecret",
    "display_name": "Mary",
}
```

#### Response Body
``` json
{
    "email": "marysue@email.com",
    "password": "3N{ryPt3d.p@S5w0Rd",
    "display_name": "Mary",
    "_id": "v3ryl0ng1dnumb3r",
    "__v": 0
}
```

### Login
POST  ```/api/v1/user/login```

- Returns a success message and token as the body of the response.
- If request body is missing any required fields or field validation fails, responds with a status code 400 and message: Ex. ```{"msg": "Please provide email and password."}```.
- If credentials in request body cannot be authenticated, responds with a status code 401 and message: Ex. ```{"msg": "Invalid credentials."}```.

| Field        | Data Type | Required? | Notes                          |
| -----------  | --------- | --------- |------------------------------- |
| email        | string    | Yes       | Must be a valid email address. |
| password     | string    | Yes       | Restraints: 6 character minimum

#### Request Body
``` json
{
    "email": "marysue@email.com",
    "password": "asecret",
}
```

#### Response Body
``` json
{
    "msg": "login sucessful",
    "token": "v3rY./0nGm1x.0fch@rAct3r5"
}
```



## JOBS
Requires authrization. If request authorization header is missing or contains invalid Bearer token, responds with a status code 400 and message: ```{"msg": "No valid token provided."}```.

### Get All Jobs
**GET**  ```/api/v1/jobs/```
- Returns the numerical count and array of jobs of the logged-in user as the body of the response.

#### Request Body
N/A

#### Response Body
``` json
{
    "count": 2,
    "jobs": [
        {
            "_id": "6887ee3dc27416661d2b1e02",
            "company": "kustom co",
            "position": "technical support engineer",
            "status": "pending",
            "createdBy": "6887ede1c27416661d2b1dfe",
            "createdAt": "2025-07-28T21:40:13.770Z",
            "updatedAt": "2025-07-28T21:40:13.770Z",
            "__v": 0
        },
        {
            "_id": "6887ee9ec27416661d2b1e07",
            "company": "awe ai",
            "position": "devrel engineer",
            "status": "declined",
            "createdBy": "6887ede1c27416661d2b1dfe",
            "createdAt": "2025-07-28T21:41:50.254Z",
            "updatedAt": "2025-07-28T21:45:22.006Z",
            "__v": 0
        }
    ]
}
```
### Get Single Job
**GET**  ```/api/v1/jobs/{id}```
- Returns the job object that matches the {id}
- If id cannot be found responds with a status code 404 and message: Ex.```{"msg": "Job with id 123456789 not found!"}```.

#### Parameters
| Parameter   | Data Type | Required? | Notes                       |
| ----------- | --------- | --------- |-----------------------------|
| id          | string    | Yes       | Must be a valid job id.       |

#### Request Body
N/A

#### Response Body
``` json
{
    "job": {
        "_id": "6887ee3dc27416661d2b1e02",
        "company": "kustom co",
        "position": "technical support engineer",
        "status": "pending",
        "createdBy": "6887ede1c27416661d2b1dfe",
        "createdAt": "2025-07-28T21:40:13.770Z",
        "updatedAt": "2025-07-28T21:40:13.770Z",
        "__v": 0
    }
}
```

### Create Job
**POST**  ```/api/v1/jobs/```
- Returns the created job object that matches the {id}
- If request body is missing any required fields or field validation fails, responds with a status code 400 and message: Ex. ```{"msg": "Please provide values for: company"}```.

#### Parameters
| Parameter   | Data Type | Required? | Notes                       |
| ----------- | --------- | --------- |-----------------------------|
| id          | string    | Yes       | Must be a valid job id.       |

#### Fields
| Field       | Data Type | Required? | Notes                       |
| ----------- | --------- | --------- | --------------------------- |
| company     | string    | Yes       | 50 character maximum.       |
| position    | string    | Yes       | 100 character maximum.      |
| status      | string    | No        | Can be "interview", "declined", or "pending" (default). |

#### Request Body
```json
{
    "company": "kustom co",
    "position": "technical support engineer"
}
```

#### Response Body
``` json
{
    "job": {
        "_id": "6887ee3dc27416661d2b1e02",
        "company": "kustom co",
        "position": "technical support engineer",
        "status": "pending",
        "createdBy": "6887ede1c27416661d2b1dfe",
        "createdAt": "2025-07-28T21:40:13.770Z",
        "updatedAt": "2025-07-28T21:40:13.770Z",
        "__v": 0
    }
}
```

### Update Job
**PATCH**  ```/api/v1/jobs/{id}```
- Returns the updated job object that matches the {id}
- If request body is missing any required fields or field validation fails, responds with a status code 400 and message: Ex. ```{"msg": "Please provide values for: company"}```. 

#### Fields
| Field       | Data Type | Required? | Notes                       |
| ----------- | --------- | --------- | --------------------------- |
| company     | string    | Yes       | 50 character maximum.       |
| position    | string    | Yes       | 100 character maximum.      |
| status      | string    | No        | Can be "interview", "declined", or "pending" (default). |

#### Request Body
```json
{
    "company": "awe ai",
    "position": "devrel engineer"
}
```

#### Response Body
``` json
{
    "job": {
        "_id": "6887ee3dc27416661d2b1e02",
        "company": "awe ai",
        "position": "devrel engineer",
        "status": "pending",
        "createdBy": "6887ede1c27416661d2b1dfe",
        "createdAt": "2025-07-28T21:40:13.770Z",
        "updatedAt": "2025-08-28T21:20:27.770Z",
        "__v": 0
    }
}
```
### Delete Job
**DELETE**  ```/api/v1/jobs/{id}```
- Returns the deleted job object that matches the {id}
- If {id} cannot be found responds with a status code 404 and message: Ex.```{"msg": "Job with id 123456789 not found!"}```.

#### Parameters
| Parameter   | Data Type | Required? | Notes                       |
| ----------- | --------- | --------- |-----------------------------|
| id          | string    | Yes       | Must be a valid job id.       |

#### Request Body
N/A

#### Response Body
``` json
{
    "job": {
        "_id": "6887ee3dc27416661d2b1e02",
        "company": "awe ai",
        "position": "devrel engineer",
        "status": "pending",
        "createdBy": "6887ede1c27416661d2b1dfe",
        "createdAt": "2025-07-28T21:40:13.770Z",
        "updatedAt": "2025-08-28T21:20:27.770Z",
        "__v": 0
    }
}
```