# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).


## Final Product

### Login page
!["screenshot login page"](https://github.com/Amphakarn/tinyapp/blob/master/docs/login-page.png?raw=true)

### Error message displayed when an unauthorized user accesses the urls page
!["screenshot message displayed when a user is not authorized"](https://github.com/Amphakarn/tinyapp/blob/master/docs/error-msg-user-not-authorized.png)

### Error message displayed when a user login with an invalid account (account does not exist in the database)
!["screenshot message displayed when a user login with an invalid account"](https://github.com/Amphakarn/tinyapp/blob/master/docs/error-msg-account-not-exist-in-db-r2.png)

### Error message displayed when a user login with an invalid username or password
!["screenshot message displayed when a user login with a wrong email or password"](https://github.com/Amphakarn/tinyapp/blob/master/docs/error-msg-invalid-email-or-pwd-r2.png)

### Error message displayed when an unauthorized user accesses a URL
!["screenshot message displayed when an unauthorized user accesses a URL that does not belong to the user"](https://github.com/Amphakarn/tinyapp/blob/master/docs/error-msg-not-login-urls-shortURL.png)

### URLS page associated to the valid logged in user"
!["screenshot urls page associated to the valid logged in user"](https://github.com/Amphakarn/tinyapp/blob/master/docs/urls-page.png?raw=true)

### Register page
!["screenshot register page"](https://github.com/Amphakarn/tinyapp/blob/master/docs/register-page.png?raw=true)

### Error message displayed when a user registers with an account that has already been in the database
!["screenshot error message displayed when a user registers with an existing account in the database"](https://github.com/Amphakarn/tinyapp/blob/master/docs/error-msg-account-exist-r2.png)

### Create new URL page
!["screenshot create new URL page"](https://github.com/Amphakarn/tinyapp/blob/master/docs/create-new-url-page.png)

### Edit long URL page
!["screenshot edit long URL page"](https://github.com/Amphakarn/tinyapp/blob/master/docs/edit-long-url-page.png?raw=true)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Create a directory on your local computer using the following commands.
    $mkdir tinyapp
    $cd tinyApp
- Clone the repository to your local computer (using the `git clone git@github.com:Amphakarn/tinyapp.git` command).
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
  ***Please note, this tinyApp is set to use the port 3000 (due to the available ports on Lighthouse Lab server). You can change the port number in express_server.js to other available port. To identify ports in use:
    - on Linux, use command: `sudo lsof -i -P -n | grep LISTEN`
    - on MAC, use command: `sudo lsof -i -n -P | grep TCP`
    - on Window, use command: `netstat -n -a –o`
- Once the server starts, the terminal will display `App listening on port PORT#!` (The server must be started first!)
- Open a Chrome browser and type `http://localhost:PORT#/urls` (replace `PORT#` with your available port number)
- You can start testing the application.