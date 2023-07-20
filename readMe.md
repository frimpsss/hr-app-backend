# Documentation

Sort of documentation for this api

## Introduction

Welcome to the API documentation for HR-APP API. This document provides detailed information about how to interact with the API, including available endpoints, request and response formats, authentication methods, and more.

## Base URL

The base url for all api endpoint is : **https://hr-app-backend-production.up.railway.app**

## Authentication

To access the API, you will need an API key. Include the API key in the request headers as follows:

Add authorization header in the http request:

```
Authorization: Bearer <Token>
```

## Responses

Always returns JSON

- #### SUCCESS RESPONSE

  - STATUS CODE 2XX

  ```
    {
        "status": true,
        "message": "Message string",
        "data": ARRAY or NULL
    }
  ```

- #### ERROR RESPONSE

  - STATUS CODE 4XX or 5XX

  ```
    {
        "status": false,
        "message": "Message string"
    }
  ```

## Endpoints

### [Create admin]

Description: Create an admin

- Method: **POST**
- URL: {{BASE_URL}}/api/admin/register

#### Body

```
{
    "email": "xx@xample.com"
    "password" : "XXXXXXXXX"
}
```

### [Admin login]

Description: Login in as an admin

- Method: **POST**
- URL: {{BASE_URL}}/api/admin/login

#### Body

```
{
    "email": "xx@xample.com"
    "password" : "XXXXXXXXX"
}
```

### [Create employee]

Description: create an employee

- Method: **POST**
- URL: {{BASE_URL}}/api/employee/register

#### Body

```
{
    "email": "xx@xample.com",
    "firstname": "John",
    "lastname": "Doe",
    "departmentId": "<Department Id>",
    "password": "XXXXXXXX",
    "role": "Developer",
    "salary": 34000,
    "gender": "Male | Female",
    "contact": "02xxxxxxxxxx"
}
```
