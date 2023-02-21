# Cloud-Native Web Application

As a part of Assignment 01 for CSYE 6225 - We are implementing REST APIs to support CRUD operations on User Data. 

## Endpoints
There are 4 endpoints defined for this particular assignment.
* /healthz
- Method : GET
- Description : Checks for Server status - returns with status 200 if server is up and running healthy

* /v1/user 
- Method : POST
- Description : Creates a user based on FirstName, LastName, Username and Password provided. ID , account_created and account_updated are set in the backend.
- Body : first_name, last_name, username and password

* /v1/user/{userid} 
- Method : GET
- Description : Upon providing username, and authenticating with username and password using BasicAuth, all details of a given user, except password will be displayed.

* /v1/user/{userid} 
- Method : PUT
- Description: Upon providing username and authenticating with username and password using BasicAuth, the user can provide updates to FirstName, LastName or Password. The account_updated timestamp will be updated in the backend.
- Body : first_name, last_name, password

## Setting up the application

* Download Node.js - version 18.x and npm
* Clone the github repository
* Since for this particular assignment it is using a local POSTGRES Database server, you will need to set the same up in your local machine
* Update the POSTGRES server details in `dbconn.js` file.
* Create a database called webapp in the POSTGRES server.
* Run `npm i` command to install all dependencies as listed in `package-lock.json`
* Start the application by running the command `node index.js`. The application should be up and running on LocalHost Port 3001.
* Use Postman to access the endpoints with the appropriate body or authentication applicable.

## Testing the application

* Test framework is set up using Jest and Supertest.
* Currently there are unit tests residing in the `/tests` directory. 
* To run the tests run `npm test`
* View the test results/coverage report.


