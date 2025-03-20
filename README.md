# Flow3 Network 自动推荐注册

## 功能

- 自动生成钱包
- 使用代理避免 IP 封禁
- 记录已创建的账户

## 要求

- Node.js v18.20.6 LTS [下载](https://nodejs.org/dist/v18.20.6/node-v18.20.6-x64.msi)
- Flow3 账户 [Flow3](https://dashboard.flow3.tech/?ref=17zQhdYiM)
- 代理（可选）最佳代理 [Cherry Proxy](https://center.cherryproxy.com/Login/Register?invite=1e2758bd)

## 安装

1. 克隆仓库：

   ```sh
   git clone https://github.com/mySatoshist/flow3-autoreg.git
   cd flow3-autoreg
   ```

2. 安装依赖：

   ```sh
   npm install
   npm run build
   ```

3. 在根目录创建 `proxy.txt` 文件并添加您的代理（每行一个）。
   ```
   http://user:pass@host:port
   http://user:pass@host:port
   http://user:pass@host:port
   ```

## 使用方法

1. 运行机器人：

   ```sh
   npm run start
   ```

2. 按照提示输入您的推荐码

## 输出

- 创建的账户将保存在 `accounts.txt` 中

## 注意事项

- 确保使用有效的代理以避免 IP 封禁

## 保持联系

- 电报频道：[Telegram](https://t.me/Satoshist01)

## 免责声明

此工具仅用于教育目的。使用风险自负。