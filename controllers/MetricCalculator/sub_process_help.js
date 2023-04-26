"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_cmd = void 0;
const child_process_1 = require("child_process");
//https://stackoverflow.com/questions/15515549/node-js-writing-a-function-to-return-spawn-stdout-as-a-string
function run_cmd(cmd, args, options) {
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(cmd, args, options);
        let output = '';
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        child.on('close', (code) => {
            globalThis.logger.debug(`child process ${cmd} ${args} closed on ${code}`);
            resolve(output);
        });
        child.on('exit', (code) => {
            globalThis.logger.debug(`child process ${cmd} ${args} exit on ${code}`);
            resolve(output);
        });
        child.on('error', (err) => {
            reject(err);
        });
    });
}
exports.run_cmd = run_cmd;
//# sourceMappingURL=sub_process_help.js.map