# Free Online Games - Next.js

Web game platform với Next.js + Vercel + JSON (No Database).

## 🚀 Cài đặt

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 🎮 Thêm games tự động

Crawl 20 games từ GameDistribution:
```bash
npm run crawl
```

Crawl nhiều hơn (ví dụ 50 games):
```bash
npm run crawl 50
```

Script tự động lấy Game ID, Title, Category, Thumbnail và thêm vào `public/games.json`.

## 🌐 Deploy lên Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Deploy tự động

## 💰 Kiếm tiền

- Google AdSense: Banner quảng cáo
- GameDistribution: Quảng cáo trong game
- Cần 15-20 games với nội dung chất lượng

## 📁 Cấu trúc

```
├── public/
│   └── games.json          # Database games
├── src/app/
│   ├── page.js            # Trang chủ
│   ├── layout.js          # Layout chung
│   └── game/[id]/
│       └── page.js        # Trang chi tiết game
├── scripts/
│   └── auto-crawl.js      # Script crawl tự động
└── package.json
```
