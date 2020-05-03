## Development mode :
after install packages with ``` npm install  ``` or ``` yarn install ``` run this command:
```
  npm run start
```

## Linting Check
before commit, to prevent build fails
```
  npm run lint
```

## Production mode :
```
  npm run build
```
now start server with ``` pm2 start ./build/app.js --name fifa-api ``` and Open http://localhost:3003 to view it in the browser

