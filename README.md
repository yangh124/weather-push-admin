## Build Setup

```bash
# 克隆项目
git clone https://github.com/yangh124/weather-push-admin.git
# 进入项目目录
cd weather-push-admin

# 安装依赖
npm install

npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9528

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## License

[MIT](https://github.com/yangh124/weather-push-admin/blob/master/LICENSE) license.

Copyright (c) 2022-present yangh124
