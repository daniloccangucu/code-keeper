import path from "path";
import fs from "fs";
import http from "http";
import https from "https";
import url from "url";

let INVENTORY_API_URL_RAW;

console.log(
  `process.env.INVENTORY_API_URL_PRODUCTION: ${process.env.INVENTORY_API_URL_PRODUCTION}`
);
console.log(`process.env.PGHOST: ${process.env.PGHOST}`);

if (process.env.INVENTORY_API_URL_PRODUCTION) {
  console.log("if process.env.INVENTORY_API_URL_PRODUCTION");
  INVENTORY_API_URL_RAW = process.env.INVENTORY_API_URL_PRODUCTION;
} else {
  console.log("else process.env.INVENTORY_API_URL_PRODUCTION");
  INVENTORY_API_URL_RAW = process.env.PGHOST;
}

console.log(`let INVENTORY_API_URL_RAW: ${INVENTORY_API_URL_RAW}`);

export const INVENTORY_API_URL = `http://${INVENTORY_API_URL_RAW}:8080/movies`;

const logDir = "/var/log/api-gateway";
const logFilePath = path.join(logDir, "gateway.log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

export function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

export function logMessage(message) {
  const timestampedMessage = `${getTimestamp()} ${message}\n`;
  console.log(timestampedMessage.trim());
  logStream.write(timestampedMessage);
}

const proxyRequestWithRetry = async (options, req, res, retries, timeout) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await new Promise((resolve, reject) => {
        const proxy = (options.protocol === "https:" ? https : http).request(
          options,
          function (proxyRes) {
            logMessage(`Response from target: ${proxyRes.statusCode}`);
            logMessage(
              `Response headers from target: ${JSON.stringify(
                proxyRes.headers
              )}`
            );
            proxyRes.pipe(res, { end: true });
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            resolve(true);
          }
        );

        proxy.on("error", function (err) {
          logMessage(`Proxy error: ${err}`);
          reject(err);
        });

        if (req.method === "POST" || req.method === "PUT") {
          const bodyData = JSON.stringify(req.body);
          logMessage(`Forwarding body: ${bodyData}`);
          proxy.setHeader(
            "Content-Type",
            req.headers["content-type"] || "application/json"
          );
          proxy.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxy.write(bodyData);
          proxy.end();
        } else {
          req.pipe(proxy, { end: true });
        }

        setTimeout(() => {
          proxy.destroy();
          reject(new Error("Timeout"));
        }, timeout);
      });

      return result;
    } catch (error) {
      if (i === retries - 1) {
        logMessage(`Final attempt failed: ${error.message}`);
        res.status(500).send("Proxy error");
        throw error;
      }
      logMessage(`Retry ${i + 1} failed: ${error.message}`);
    }
  }
};

function customProxy(req, res) {
  const targetUrl = INVENTORY_API_URL;
  const parsedUrl = url.parse(targetUrl);

  logMessage(
    `Parsed URL - Protocol: ${parsedUrl.protocol}, Hostname: ${parsedUrl.hostname}, Port: ${parsedUrl.port}, Pathname: ${parsedUrl.pathname}`
  );

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + req.url.replace("/api/movies", ""),
    method: req.method,
    headers: {
      ...req.headers,
      host: parsedUrl.hostname,
    },
  };

  logMessage(
    `Proxying ${req.method} request to: ${options.hostname}:${options.port}${options.path}`
  );

  proxyRequestWithRetry(options, req, res, 100, 2000).catch((err) => {
    logMessage(`All retries failed: ${err.message}`);
  });
}

export default customProxy;
