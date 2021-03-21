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

### Local environment setup:

1. Update the `.env` file using reference from `sample.env`
2. Run `yarn install` to install packages
3. Install docker-compose (https://docs.docker.com/compose/install/) in your system. Proceed further if already done
4. Start MongoDB and Redis service using `docker-compose up`
5. Running `yarn start:dev` will start the server with hot-reload

#### Links

- HTTP API server: http://localhost:8080
- Socket.io server: http://localhost:65080

### Production setup (maintainers only):

- To be updated for docker-container and k8s support

#### Old version

Build and use pm2 to start your process

```bash
npm run build
pm2 start ./build/app.js --name fifa-api
```

