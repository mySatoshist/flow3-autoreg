import axios, { AxiosRequestConfig } from "axios";
import chalk from "chalk";
import fs from "fs";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import { logMessage } from "../utils/logger";

let proxyList: string[] = [];
let axiosConfig: AxiosRequestConfig = {};

export function getProxyAgent(proxyUrl: string, index: number, total: number): HttpsProxyAgent<any> | SocksProxyAgent | null {
  try {
    const isSocks = proxyUrl.toLowerCase().startsWith("socks");
    if (isSocks) {
      return new SocksProxyAgent(proxyUrl);
    }
    return new HttpsProxyAgent(
      proxyUrl.startsWith("http") ? proxyUrl : `http://${proxyUrl}`
    );
  } catch (error) {
    if (error instanceof Error) {
      logMessage(
        index,
        total,
        `Error creating proxy agent: ${error.message}`,
        "error"
      );
    } else {
      logMessage(
        index,
        total,
        `Error creating proxy agent`,
        "error"
      );
    }
    return null;
  }
}

export function loadProxies(): boolean {
  try {
    const proxyFile = fs.readFileSync("proxy.txt", "utf8");
    proxyList = proxyFile
      .split("\n")
      .filter((line) => line.trim())
      .map((proxy) => {
        proxy = proxy.trim();
        if (!proxy.includes("://")) {
          return `http://${proxy}`;
        }
        return proxy;
      });

    if (proxyList.length === 0) {
      throw new Error("No proxies found in proxies.txt");
    }
    console.log(
      chalk.green(`✓ Loaded ${proxyList.length} proxies from proxies.txt`)
    );
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`[!] Error loading proxies: ${error.message}`));
    } else {
      console.error(chalk.red(`[!] Error loading proxies`));
    }
    return false;
  }
}

export async function checkIP(index: number, total: number): Promise<boolean> {
  try {
    const response = await axios.get(
      "https://api.ipify.org?format=json",
      axiosConfig
    );
    const ip = response.data.ip;
    logMessage(index, total, `IP Using: ${ip}`, "success");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      logMessage(index, total, `Failed to get IP: ${error.message}`, "error");
    } else {
      logMessage(index, total, `Failed to get IP`, "error");
    }
    return false;
  }
}

export async function getRandomProxy(index: number, total: number): Promise<string | null> {
  if (proxyList.length === 0) {
    axiosConfig = {};
    await checkIP(index, total);
    return null;
  }

  let proxyAttempt = 0;
  while (proxyAttempt < proxyList.length) {
    const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
    try {
      const agent = getProxyAgent(proxy, index, total);
      if (!agent) continue;

      axiosConfig.httpsAgent = agent;
      await checkIP(index, total);
      return proxy;
    } catch (error) {
      proxyAttempt++;
    }
  }

  logMessage(index, total, "Using default IP", "warning");
  axiosConfig = {};
  await checkIP(index, total);
  return null;
}