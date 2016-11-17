Development
===
Setup
---

### Mysql
To run the app locally, you'll need to:
* Install mysql locally
* Run mysql
* Create a database to be used
* Create a user with all permissions for the database
* Setup an environment variable so the app knows what database to access
(see Envionrment Variables below)

### Environment Variables
Create a file named ".env" in the root directory.
There are some environmental variables that need to be defined here 
for the app to work correctly.

Define the following variables:
> NODE_ENV='development'  
> PORT=3000  
> API_URL=http://localhost:3000/api  
> API_DB_URL=mysql://username:password@localhost:3306/db_name  
> SECRET="something"  
> ADMIN_PASSWORD="whatever"  

### Load Default Data into the Database
After setting up your database and environment variables, you can load some default data by running:  
`npm run load-fixtures`

Watch Tasks
---
To compile server code to es5 (build directory) and rebuild in response to changes:  
`npm run build-server-watch`

To run the server, and restart on any changes:  
`npm run dev-server-watch`

To recompile frontend on change:  
`npm run build-frontend-watch`

Testing
===

Make sure the server is built and running:  
`npm run build-server`  
`npm run dev-server`

Then run the test suite:  
`npm test`