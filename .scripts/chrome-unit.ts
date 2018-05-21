import { spawn, exec } from "child_process";
import { join } from "path";

const webpackDevServer = spawn(join(__dirname, "../node_modules/.bin/ts-node"), [join(__dirname, "../testserver")], { shell: true })

let mochaChromeRunning = false
const webpackDevServerHandler = async (data: Buffer) => {
  if (!mochaChromeRunning) {
    mochaChromeRunning = true
    const mochaChrome = spawn(join(__dirname, "../node_modules/.bin/mocha-chrome"), ["http://localhost:3004"], { shell: true, stdio: "inherit" });
    mochaChrome.on("exit", () => {
      webpackDevServer.stderr.destroy();
      webpackDevServer.stdout.destroy();
      webpackDevServer.kill();
    });
  }
}

webpackDevServer.stderr.on('data', data => console.error(data.toString()));
webpackDevServer.stdout.on('data', webpackDevServerHandler);
webpackDevServer.on('exit', webpackDevServerHandler);
