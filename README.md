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
```markdown
Install
pnpm install --save-dev typescript @types/node @types/react @types/ramda
pnpm i
pnpm dlx tsc --init

Local Deploy
pnpm install
pnpm dev
visit: http://localhost:3000

Tailwind
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Docker/Synology NAS
docker build -t rummy-app-ts .
docker run -p 3000:3000 -v $(pwd)/data:/app/data rummy-app-ts
visit: http://<your-nas-ip>:3000

```
If you don't have pnpm installed, install it with:

```bash
npm install -g pnpm
```
