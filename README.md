## IoTera Technical Test

This is a project of tech test when created by me. And the project is using of Next.JS with Bun Runtime.

## Tech Stack
- Next.JS
- Bun Runtime
- Tailwind CSS
- Lucide Icons

## Deployment
This project was deployed on cloudflare, u can visit this link : https://rj-tech-assesment.dev

## How to run this project
1. The first u can create .env file in the root dir (copy .env.example)
2. Copy this env for correct config
```env
LOGIN_API_URL=https://asia-southeast2-iotera-vending.cloudfunctions.net/login
DEVICE_LOG_API_URL=https://api-serverless.iotera.io/1000000021/data
SESSION_SECRET=<CREATE_RANDOM_SECRET_CODE_HERE>
```
3. Run this command to start the project
```bash
bun install
bun run dev
```

4. Login using this credential
```
username: user
password: password
```