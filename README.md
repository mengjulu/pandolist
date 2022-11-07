# Pandolist
A to-do list that you can chat with members and set notification.


# Table of Contents
- [Live Demo](#live-demo)
- [Build With](#build-with)
- [Getting Started](#getting-started)
- [API Usage](#api-usage)
- [Screeshot](#screeshot)

# Live Demo

:round_pushpin: https://pandolist.herokuapp.com/

### Test info
:bust_in_silhouette: **User**
>  account: test@test.com\
>  password: test1234

# Build With
- Node.js (Express)
- EJS
- Mongodb (mongoose)
- Authentication (Passport.js)
- Notification (Google calendar/line notify-bot)
- Socket.io<area>
- Mocha & Chai & Sinon & Supertest

# Getting Started

### **Clone**
    git clone https://github.com/mengjulu/pandolist.git
    cd pandolist

### **Install**
    npm install 

### **Add .env file**
    GOOGLE_CLIENT_ID=<google client id>
    GOOGLE_CLIENT_SECRET=<google client secret>
    GOOGLE_CLIENT_CALLBACK_URL=<google client callback url>
    LINE_NOTIFY_ID=<line notify id>
    LINE_NOTIFY_SECRET=<line notify secret>
    LINE_NOTIFY_CALLBACK_URL=<line notify callback url>
    GOOGLE_CLIENT_ID_CALENDAR=<google client calendar id>
    GOOGLE_CLIENT_SECRET_CALENDAR=<google client calendar secret>
    GOOGLE_CLIENT_SECRET_CALENDAR_URL=<google client calendar callback url>
    IMGUR_CLIENT_ID=<imgur client id>
    IMGUR_CLIENT_SECRET=<imgur client secret>
    IMGUR_REFRESH_TOKEN=<imgur client refresh token>
    IMGUR_ALBUM_ID=<imgur client album id>
    MONGODBURL=<mongodb url>
    SESSIONSECRET=<session secret>
    *REDIS_HOST=<redis host>
    *REDIS_PORT=<redis port>
    *REDIS_PASSWORD=<redis password>
    *UPSTASH_REDIS_URL=<Use for heroku redis service>
 <sub>*Redis related variable only use for heroku redis service. Therefore, leave them blank if you run code locally.</sub>  
 
### **Start (port: 3000)**
    npm start 

### **Test**
    npm test

# API Usage

| Method | Route | Description |
|:-------------|:-------------|:------------------------------|
| **INDEX** |
| GET | `/` |Get index page |
| GET | `/mylist` | Get user's lists of events |
| GET | `/search` | Get search result |
| POST | `/search` | Search keywords |
| **PROJECT** | 
| POST | `/project` | Create a new project|
| PATCH | `/project` | Change the project's title |
| DELETE | `/project` | Delete the project|
| POST | `/project/auth` | Add new member to the project |
| DELETE | `/project/auth` | Remove the authorization of member from the project |
| **LIST** |
| GET | `/list/:<projectnum>` | Get project page |
| POST | `/list/:<projectnum>` | Create a new list in the project 
| PATCH |`/list/:<projectnum>/:<listId>`| Edit the list |
| DELETE |`/list/:<projectnum>/:<listId>`| Delete the list |
| PATCH |`/list/:<listId>`| check the list |
| PUT |`/list/:<listId>`| Set due date for the list |
| **REMINDER** | 
| GET | `/line-notify/:<listId>` | Set line notification |
| GET | `/line-notify/callback` | Set line auth callback |
| GET | `/google/calendar/:<listId>` | Set google calendar reminder |
| GET | `/google/pandolist/calendar` | Set google auth callback |
| **MESSAGE** | 
| POST | `/message` | Create a new message|
| **ACCOUNT (/account)** |
| GET | `/settings` | Get setting page |
| GET | `/password` | Get change password page |
| POST| `/settings` | Edit user's avatar |
| PATCH | `/settings` | Edit user's name |
| **AUTH (/auth)** |
| GET | `/sign-up` | Get sign up page |
| GET | `/sign-in` | Get sign in page |
| GET | `/google` | Get google auth page |
| GET | `/google/pandolist` | Sign in/up with passport google strategy |
| GET | `/sign-out` | Sign out |
| POST | `/sign-up` | Sign up with passport local strategy |
| POST | `/sign-in` | Sign in with passport local strategy |
| PATCH | `/password` | Change password |

# Screeshot
- Index (visitor)
<img width="800" alt="Index (visitor)" src="https://user-images.githubusercontent.com/52753746/186680337-ccd54b26-6f44-4899-a7d7-f6592526b075.png">

- Index (user)
<img width="800" alt="Index (user)" src="https://user-images.githubusercontent.com/52753746/186682394-17d934a1-cd1b-446b-8b9c-2d0cf37cb9ee.png">

- Google auth with approved account
<img width="800" alt="googleauth" src="https://user-images.githubusercontent.com/52753746/186711605-830a4b24-9727-4b5a-ba75-e53027429aeb.gif">

- project(create/edit title/delete)
<img width="800" alt="project" src="https://user-images.githubusercontent.com/52753746/186728809-01856adb-7460-42ea-9313-cfcfecfa996c.gif">

- project authorization
<img width="800" alt="projectAuth" src="https://user-images.githubusercontent.com/52753746/186808584-e1cb4243-88ed-4d58-b9ff-2d953521eeb4.gif">

- project chat
<img width="800" alt="projectchat" src="https://user-images.githubusercontent.com/52753746/186813992-69b24d54-840b-4c99-ba95-b08f4804f5a3.gif">

- list (create/edit/check/delete)
![list](https://user-images.githubusercontent.com/52753746/186718174-9c85fdec-d2da-4843-8fd8-466521d7c4e0.gif)
- user profile
<img width="984" alt="user profile" src="https://user-images.githubusercontent.com/52753746/186805774-eab77c77-4f6d-461a-83a3-747a15d8e85a.png">
<img width="800" alt="list" src="https://user-images.githubusercontent.com/52753746/186718174-9c85fdec-d2da-4843-8fd8-466521d7c4e0.gif">

- user settings
<img width="800" alt="user settings" src="https://user-images.githubusercontent.com/52753746/186805774-eab77c77-4f6d-461a-83a3-747a15d8e85a.png">

- google notification
<img width="800" alt="google notification" src="https://user-images.githubusercontent.com/52753746/186853478-35ba2fa7-3b8f-4c00-908b-e74348a040dc.gif">
