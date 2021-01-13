# Level Up Server

This is the server connection for sgp-level-up-client.herokuapp.com, an application where game enthusiasts can level up their gaming experience and make easier decisions on their next game to play!

# Full CRUD!
POST,GET,PUT,DELETE for Reviews, WantToPlay, & Library
POST,GET,PUT for Users

# 21 Endpoints + 3rd Party API CALL!
There are endpoints for Users, Admin, and even Banned users. Guests can read only as well!

# RESTFUL API
This application utilizes PostgreSQL and Node.js and Sequelize in order to manage the data of the application.

# Database Associations
This appliation uses the following database associations:

## One-to-One
Reviews to User
WantToPlay to User
Library to User

## One-to-Many
User to Reviews
User to WantToPlay
User to Library

# Clone Instructions
Once this repo has been clone, run an npm install in the server terminal to install the all the goods needed.

# Deployed URL
You can see the applications full functionality at https://sgp-level-up-client.herokuapp.com/

# User Registration and Login
Registration: /user/register
Login: /user/login

# Admin
Three Levels of Access Guest, User, Admin

# Authentication
This appliaction uses password encryption with bcrypt and session validation with jwt