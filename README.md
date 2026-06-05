# 커플 가계부 💕

부부/커플이 함께 쓰는 귀여운 가계부 웹앱

## 환경 변수 설정

`.env.local` 파일을 만들고 아래 값을 채워주세요:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_APP_PIN=123456
```

## Vercel 배포

1. GitHub에 push
2. Vercel에서 프로젝트 import
3. Environment Variables에 위 7개 변수 입력
4. Deploy

## 로컬 실행

```bash
npm install
npm run dev
```
