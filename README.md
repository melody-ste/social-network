# My social - network

## Overview

This is a simple social network application built with React for the frontend and Strapi as the backend. It allows users to:

- Create posts
- Like posts
- Delete their own posts
- View posts from all users

The project demonstrates the use of global state management with Jotai, JWT authentication, and REST API interactions with Strapi.


## Features

1. **User Authentication**
   - Login and signup handled via Strapi Users & Permissions plugin
   - JWT tokens stored in global state using Jotai

2. **Posts**
   - Users can create posts (text only)
   - Posts show the author username
   - Users can delete their own posts
   - Users can like posts
