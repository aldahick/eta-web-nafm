import * as eta from "../eta";
import * as childProcess from "child_process";
import * as chokidar from "chokidar";
import * as util from "util";
const exec = util.promisify(childProcess.exec);

export default class EngineGenerationLifecycle extends eta.ILifecycleHandler {
    // private watcher: chokidar.FSWatcher;
    // private isGenerating = false;
    // public async beforeServerStart(): Promise<void> {
    //     if (!eta.config.dev.enable) return;
    //     this.watcher = chokidar.watch(eta.constants.modulesPath + "/hicks-web-nafm/lib/engine");
    //     this.watcher.on("change", async (path: string) => {
    //         if (this.isGenerating || !path.endsWith(".ts")) return;
    //         this.isGenerating = true;
    //         await eta.cli.exec("generate indexes");
    //         await eta.cli.exec("compile client", "hicks-web-nafm");
    //         eta.logger.trace("Recompiled NAFM client JS.");
    //         this.isGenerating = false;
    //     });
    // }
    //
    // public async onServerStop(): Promise<void> {
    //     if (this.watcher) this.watcher.close();
    // }
}
