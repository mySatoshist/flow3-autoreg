import chalk from "chalk";
import fs from "fs";
import { Flow3Referral } from "./classes/flow3";
import { getRandomProxy, loadProxies } from "./classes/proxy";
import { logMessage, prompt, rl } from "./utils/logger";

async function main(): Promise<void> {
  console.log(
    chalk.cyan(`
░█▀▀░█░░░█▀█░█░█░▀▀█
░█▀▀░█░░░█░█░█▄█░░▀▄
░▀░░░▀▀▀░▀▀▀░▀░▀░▀▀░
     作者：币圈老炮 
     https://t.me/Satoshist01
  `)
  );

  const refCode = await prompt(chalk.yellow("请输入推荐码: "));
  const count = parseInt(await prompt(chalk.yellow("您想创建多少个账户? ")));
  const proxiesLoaded = loadProxies();
  if (!proxiesLoaded) {
    console.log(chalk.yellow("没有可用的代理。使用默认IP。"));
  }
  let successful = 0;
  const accountsFlow = fs.createWriteStream("accounts.txt", { flags: "a" });
  const tokenAccount = fs.createWriteStream("token.txt", { flags: "a" });

  try {
    let retryCount = 0;
    const maxRetries = 3;
    while (successful < count) {
      console.log(chalk.white("-".repeat(85)));
      const currentProxy = await getRandomProxy(successful + 1, count);
      const flow = new Flow3Referral(refCode, currentProxy, successful + 1, count);

      try {
        const token = await flow.login();
        if (token) {
          const wallet = flow.getWallet();
          logMessage(successful + 1, count, `钱包地址: ${wallet.publicKey}`, "success");
          logMessage(successful + 1, count, `私钥: ${wallet.secretKey}`, "success");
          accountsFlow.write(`钱包地址: ${wallet.publicKey}\n私钥: ${wallet.secretKey}\n`);
          tokenAccount.write(`${wallet.secretKey}\n`);
          accountsFlow.write(`===================================================================\n`);
          successful++;
          retryCount = 0;
        }
      } catch (error) {
        logMessage(successful + 1, count, `错误: ${(error as Error).message}, 重试中...`, "error");
        retryCount++;
        if (retryCount >= maxRetries) {
          console.log(chalk.red("达到最大重试次数，跳过..."));
          successful++;
          retryCount = 0;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }

  } finally {
    accountsFlow.end();
    tokenAccount.end();
    console.log(chalk.magenta("\n[*] 完成！"));
    rl.close();
  }
}

main().catch((err) => {
  console.error(chalk.red("发生错误:"), err);
  process.exit(1);
});