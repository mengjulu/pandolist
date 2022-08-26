# Pandolist
A to-do list that you can chat with members and set notification.


# Table of Contents
- [Live Demo](https://github.com/mengjulu/pandolist/readme.md "Live Demo")
- [Build With](https://github.com/mengjulu/pandolist/readme.md "Build With")
- [Getting Started](https://github.com/mengjulu/pandolist/readme.md "Getting Started")
- [API Usage](https://github.com/mengjulu/pandolist/readme.md "API Usage")
- [Screeshot](https://github.com/mengjulu/pandolist/readme.md "Screeshot")

# Live Demo
### [https://pandolist.herokuapp.com/](https://pandolist.herokuapp.com/)

<sub> ** Google auth is in development mode, so only approved accounts can be authenticated.
</sub> 
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

### **Start (port: 3000)**
    npm start 

### **Test**
    npm test

<sub>** Google client related, LINE notify related, imgur related and mongo atlas account are needed.</sub> 

# API Usage

| Method|Route | Description |
|:-------------:|:-------------:|:------------------------------:|
| **INDEX** |
| GET | `/` |Get index page |
| GET | `/mylist` | Get user's lists of events |
| GET | `/search` | Get search result |
| POST | `/search` | Search keywords |
| **PROJECT** | 
| POST | `/project` | Create a new project|
| POST | `/project/auth` | Add new member to the project |
| PATCH | `/project/title` | Change the project's title |
| DELETE | `/project` | Delete the project|
| DELETE | `/project/auth` | Remove the authorization of member from the project |
| **LIST** |
| GET | `/list/:<projectnum>` | Get project page |
| POST | `/add/list/:<projectnum>` | Create a new list in the project 
| PATCH |`/edit/list/:<projectnum>/:<listId>`| Edit the list |
| PATCH |`/check/list/:<projectnum>/:<listId>`| check the list |
| PATCH |`/setdate/list/:<listId>`| Set due date for the list |
| DELETE |`/delete/list/:<projectnum>/:<listId>`| Delete the list |
| **REMINDER** | 
| GET | `/line-notify/:<listId>` | Set line notification |
| GET | `/line-notify/callback` | Set line auth callback |
| GET | `/google/calendar/:<listId>` | Set google calendar reminder |
| GET | `/google/pandolist/calendar` | Set google auth callback |
| **MESSAGE** | 
| POST | `/create/message` | Create a new message|
| **ACCOUNT (/account)** |
| GET | `/settings` | Get etting page |
| GET | `/password` | Get change password page |
| POST| `/profile/avatar` | Edit user's avatar |
| PATCH | `/profile/name` | Edit user's name |
| **AUTH (/auth)** |
| GET | `/sign-up` | Get sign up page |
| GET | `/sign-in` | Get sign in page |
| GET | `/google` | Get google auth page |
| GET | `/google/pandolist` | Sign in/up with passport google strategy |
| GET | `/sign-out` | Sign out |
| POST | `/sign-up` | Sign up with passport local strategy |
| POST | `/sign-in` | Sign in with passport local strategy |
| PATCH | `/change/password` | Change password |

# Screeshot
- Index (visitor)
<img width="957" alt="Index (visitor)" src="https://user-images.githubusercontent.com/52753746/186680337-ccd54b26-6f44-4899-a7d7-f6592526b075.png">
- Index (user)
<img width="955" alt="Index (user)" src="https://user-images.githubusercontent.com/52753746/186682394-17d934a1-cd1b-446b-8b9c-2d0cf37cb9ee.png">
- Google auth with approved account
![](https://user-images.githubusercontent.com/52753746/186711605-830a4b24-9727-4b5a-ba75-e53027429aeb.gif)
- project(create/edit title/delete)
![project](https://user-images.githubusercontent.com/52753746/186728809-01856adb-7460-42ea-9313-cfcfecfa996c.gif)
- project authorization
![projectAuth](https://user-images.githubusercontent.com/52753746/186808584-e1cb4243-88ed-4d58-b9ff-2d953521eeb4.gif)
-project chat
![projectchat](https://user-images.githubusercontent.com/52753746/186813992-69b24d54-840b-4c99-ba95-b08f4804f5a3.gif)
- list (create/edit/check/delete)
![list](https://user-images.githubusercontent.com/52753746/186718174-9c85fdec-d2da-4843-8fd8-466521d7c4e0.gif)
- user settings
<img width="984" alt="user settings" src="https://user-images.githubusercontent.com/52753746/186805774-eab77c77-4f6d-461a-83a3-747a15d8e85a.png">

- google notification
![google notification](https://user-images.githubusercontent.com/52753746/186853478-35ba2fa7-3b8f-4c00-908b-e74348a040dc.gif)