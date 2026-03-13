# Installation Instructions

To set up this project locally, follow these steps:

## Prerequisites
- Node.js (v14 or later)
- npm (Node Package Manager)
- MongoDB or another database specified in the project

## Step-by-Step Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/subbups29-cyber/ag-panel-v1.0.0.git
   cd ag-panel-v1.0.0
2 Install dependencie
   ``` apt install npm```
   ```npm install```
   
3 Set up the environment

Create a .env file in the root folder and populate it with the necessary environment variables as mentioned in the .env.example file.

4 Run the database migration (if any) 
    ```npm run migrate```

5 Start the application
   ```npm start```
   
## Default Login Credentials
Username: admin
Password: password123

## How to Run the Panel Locally
Once the application is running, open your web browser and navigate to http://localhost:3000. You will be prompted to enter the login credentials mentioned above
