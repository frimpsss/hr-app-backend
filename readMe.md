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

## Rate limiting
No rate limiting enforced as at now

## Endpoints

### [Create admin]
Description: Create an admin
- Method:   **POST**
- URL: {{BASE_URL}}/api/admin/register

```
Body

{
    "email": "String", 
    "password" : "String"
}
```



### [Admin login]
Description: Login in as an admin
- Method:   **POST**
- URL: {{BASE_URL}}/api/admin/login

- Body
```
Body

{
    "email": "String", 
    "password" : "String"
}
```

### [Create employee]
Description: create an employee
- Method:   **POST**
- URL: {{BASE_URL}}/api/employee/register
```
Body

{
    "email": "frimps@xamplex.co",
    "firstname": "evame",
    "lastname": "Doe",
    "departmentId": "clk8dt0wx0008v4wz0r27seuf",
    "password": "testing",
    "role": "PornStart",
    "salary": 34000, 
    "gender": "Male"
}
```