# SPACE — 个人导航页

一个简洁可配置的浏览器起始页 / 导航页，支持随机壁纸、引擎切换、自定义收藏链接。

## 特性

- **随机壁纸** — 基于 picsum.photos，支持自定义壁纸源
- **搜索引擎切换** — 内置 Google / Bing / 百度 / DuckDuckGo，可选自定义标签
- **导航链接** — 网格布局，支持 simple-icons 和 Lucide 图标
- **一言座右铭** — 每次打开随机展示一言，支持自定义
- **时钟显示** — 实时时间与日期
- **响应式** — 桌面与移动端自适应
- **零构建配置** — 修改 `public/conf.yml` 即可生效，无需重新构建

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 配置

所有配置集中在 `public/conf.yml`，支持：

| 字段 | 说明 |
|------|------|
| `html_title` | 浏览器标签标题 |
| `logo` | 页面 Logo 文字 |
| `motto` | 座右铭（留空自动获取一言） |
| `theme.grid_columns` | 导航网格列数 |
| `theme.hover_effect` | 悬停动画效果 |
| `theme.nav_bg` | 导航方块背景 |
| `background.wallpaper_source` | 壁纸来源（picsum / custom） |
| `search.default_engine` | 默认搜索引擎 |
| `search.engine_labels` | 搜索引擎显示名称 |
| `links` | 导航链接列表 |

### 图标

导航图标支持两种来源：

- **simple-icons** — 品牌图标，预览于 [simpleicons.org](https://simpleicons.org/)，格式 `simple:github`
- **Lucide** — 通用图标，预览于 [lucide.dev/icons](https://lucide.dev/icons/)，格式 `lucide:home`

## 项目结构

```
src/
├── components/       # 组件
│   ├── ClockDisplay.vue
│   ├── LinksGrid.vue
│   ├── LoadingSpinner.vue
│   ├── NavIcon.vue
│   └── SearchBar.vue
├── composables/      # 组合式函数
│   ├── useClickAway.ts
│   ├── useClock.ts
│   ├── useConfig.ts
│   └── useHitokoto.ts
├── pages/
│   └── HomePage.vue  # 主页面
├── styles/
│   └── tokens.css    # 设计令牌
├── types/
│   └── config.ts     # 类型定义
└── utils/
    └── wallpaper.ts  # 壁纸工具
```

## 许可证

MIT
