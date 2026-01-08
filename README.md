# 🚀 Next.js 15 全端部落格系統 (Full-Stack Blog)

這是一個基於 **Next.js 15+** 與 **App Router** 架構開發的全端部落格系統。本專案整合了現代化 Web 開發的核心技術，從前端 UI 交互到後端 API 權限校驗，並成功部署於 Vercel 雲端平台。

---

## 🛠 技術棧詳解

### 1. 後端開發技術 (Backend Stack)
後端基於 Next.js 的伺服器端功能，實作了高效且安全的 Serverless 邏輯。
* **Next.js Route Handlers**: 實作 RESTful API（GET, POST, DELETE, PATCH），取代傳統 Express 框架。
* **JWT (JSON Web Tokens)**: 透過安全加密的方式進行身份驗證狀態傳遞。
* **Dynamic Routing**: 使用 `[postId]` 實作動態資源定位，精準處理特定文章操作。
* **Bcryptjs**: 對使用者密碼進行高強度雜湊加密，保障資料庫安全。



### 2. 前端開發技術 (Frontend Stack)
前端專注於高性能渲染與流暢的使用者互動體驗。
* **React 19**: 運用 Server Components 提升 SEO 與首頁加載速度，搭配 Client Components 處理互動邏輯。
* **Tailwind CSS**: 採用原子化 CSS 實作響應式佈局（RWD），確保手機與桌面端的一致體驗。
* **Lucide React**: 整合高品質圖標庫，提升介面視覺導引。
* **Optimistic UI**: 在刪除與按讚功能中實作「樂觀更新」，大幅減少使用者等待的體感時間。

### 3. 資料庫與儲存技術 (Database Stack)
使用 NoSQL 架構，確保資料存取的彈性與擴展性。
* **MongoDB Atlas**: 雲端代管資料庫，支援全球分佈與高可用性。
* **Mongoose (ODM)**:
    * **Schema Validation**: 嚴格定義資料模型，確保資料的一致性與完整性。
    * **Singleton Connection**: 在 Serverless 環境下優化連線池管理，防止連線溢出。
* **Advanced Query**: 實作分頁與排序邏輯，優化資料抓取性能。



### 4. 身份驗證與第三方登入 (Auth & Third-party)
整合業界標準協議，確保會員系統的安全性與便利性。
* **NextAuth.js (Auth.js)**: 處理複雜的 OAuth 流程、Session 持久化與 Cookie 安全管理。
* **Google OAuth 2.0**: 整合 Google 開發者平台，實作一鍵第三方授權登入。
* **
