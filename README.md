Install
npm install --save-dev typescript @types/node @types/react @types/ramda
npx tsc --init

Local Deploy
npm install
npm run dev
visit: http://localhost:3000

Docker/Synology NAS
docker build -t rummy-app-ts .
docker run -p 3000:3000 -v $(pwd)/data:/app/data rummy-app-ts
visit: http://<your-nas-ip>:3000
