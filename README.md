# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot login page"](#)
!["screenshot description"](#)

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