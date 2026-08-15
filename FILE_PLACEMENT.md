文件放置与替换说明

这份项目以根目录的 package.json 为入口。请在 VS Code 中直接打开整个
lz-shop-corrected 文件夹，不要只打开 frontend 子文件夹。

正确目录

lz-shop-corrected/
├── app/                    网站页面、表单、问答和 API
├── build/                  构建插件
├── db/                     数据库连接、结构和读写
├── drizzle/                数据库迁移
├── lib/                    产品资料、验证和追踪工具
├── public/                 图标和两段视频
├── scripts/                构建与检查脚本
├── tests/                  自动测试
├── types/                  Cloudflare 本地类型声明
├── worker/                 Cloudflare Worker 入口
├── package.json            项目依赖与命令
├── package-lock.json       锁定的完整依赖版本
├── tsconfig.json           TypeScript 设置
└── vite.config.ts          网站构建设置

不要再使用的旧文件

旧压缩包里的以下路径属于早期 GitHub Pages / Express 版本，不能和当前网站混用：

frontend/
backend/
.github/workflows/deploy-pages.yml

旧工作流只会发布 frontend/，所以会显示错误的旧页面；旧后端也缺少依赖和模型。
请保留原压缩包作为备份，然后使用本修正版整个文件夹。

Ubuntu / WSL 运行

cd ~/lz-shop-corrected
npm install
npm run lint
npx tsc --noEmit
npm test
npm run dev

项目要求 Node.js 22.13 或更新版本。npm run dev 启动后，按终端显示的本地网址
在浏览器查看。

VS Code 红线

请确认 VS Code 左下角显示 WSL: Ubuntu，并直接打开项目根目录。项目内的
.vscode/settings.json 会让 VS Code 使用本项目自己的 TypeScript 和 ESLint。
完成 npm install 后，如仍显示旧红线，可执行命令面板中的
TypeScript: Restart TS Server。