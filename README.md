## About
This is the backend for **"Football Draft Simulator"** project. It exposes a http server and a websockets server in NodeJS environment. Also servers the Algolia Search engine for supporting football players search from data scraped using **[Football Players Data Crawler](https://github.com/sauravhiremath/fifa-stats-crawler)**

## How the game works

It's a turn-based multiplayer game. This game in particular allows you to build your own Football Team, by choosing players based on turns. You can search these football players in the same platform. Filter them based on any stats (their name, rating, team, positions, and a lot more!)

**To play:**
- Create a room (add a password, if you wanna keep it private)
- Share the room ID with your friends, and they can join the room
- Once, all players are ready the draft begins
- Each user can choose their player from the search box
  - Every turn has a time limit, so pick before the time runs out!
- After you create your dream teams, use the same teams on your FIFA game and play with each other

This was created mainly for offline gaming, to avoid writing player lists manually on a paper or sending on chats when creating custom teams amongst a group of friends. Easily search and add players to your teams with this platform as a middleman :smile:

## Project Architecture
![architecture](https://miro.medium.com/max/1400/1*QEqiWlUQaaJ1DsjEUhN4dA.png)

## Getting Started

### Development mode:
Install and start the server

```bash
npm install
npm run start
```

### Production mode:
Build and use pm2 to start your process

```bash
npm run build
pm2 start ./build/app.js --name fifa-api
```

