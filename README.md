Install
npm install --save-dev typescript @types/node @types/react @types/ramda
npx tsc --init

Local Deploy
npm install
npm run dev
visit: http://localhost:3000


Docker/Synology NAS
Build the Docker image:
```sh
docker build -t rummy-app-ts .
```
Run the container (mounts local data directory):
```sh
docker run -p 3000:3000 -v $(pwd)/data:/app/data rummy-app-ts
```
Visit: http://<your-nas-ip>:3000

### Docker Image Utilities

Inspect the architecture of the built image:
```sh
docker image inspect rummy-app-ts:latest --format='{{.Architecture}}'
```

Build a multi-architecture image (e.g., for x86_64/amd64):
```sh
docker buildx build --platform linux/amd64 -t rummy-scorecard:x86_64 .
```

Export the built image to a tar file (for transfer or import):
```sh
docker save -o rummy-scorecard-x86_64.tar rummy-scorecard:x86_64
```
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
