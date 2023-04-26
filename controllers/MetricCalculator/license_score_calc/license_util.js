"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_licenses_result = exports.clone_and_install = void 0;
const path_1 = require("path");
const sub_process_help_1 = require("../sub_process_help");
const promisify = require('util.promisify-all');
// license-checker has no type file
const checker_orig = require('license-checker');
const checker = promisify(checker_orig);
function clone_and_install(tmp_dir, git_url) {
    return __awaiter(this, void 0, void 0, function* () {
        const git_folder_name = 'package';
        try {
            const git_out = yield (0, sub_process_help_1.run_cmd)('git', ['clone', git_url, git_folder_name], {
                cwd: tmp_dir,
            });
            globalThis.logger.debug(git_out);
        }
        catch (err) {
            if (err instanceof Error) {
                globalThis.logger.error(`Error while cloning: ${err.message}`);
            }
            return false;
        }
        try {
            const npm_out = yield (0, sub_process_help_1.run_cmd)('npm', ['install', '--omit=dev'], {
                cwd: (0, path_1.join)(tmp_dir, git_folder_name),
            });
            globalThis.logger.debug(npm_out);
        }
        catch (err) {
            if (err instanceof Error) {
                globalThis.logger.error(`Error while npm install: ${err.message}`);
            }
            return false;
        }
        return true;
    });
}
exports.clone_and_install = clone_and_install;
// Example of using promise using async
// https://janelia-flyem.github.io/licenses.html
// https://en.wikipedia.org/wiki/ISC_license
// https://en.wikipedia.org/wiki/GNU_Lesser_General_Public_License#Differences_from_the_GPL
// Only allow the following licenses in module and dependencies:
//  MIT, Apache, ISC, WTFPL, BSD, BSD-Source-Code, CC0-1.0, Public Domain, LGPL-2.1-only, CC-BY-*
//  This uses SPDX Identifiers
// Does NOT handle custom or unlicenses modules. Defaults them to valid for now.
function check_licenses_result(path_to_check) {
    return __awaiter(this, void 0, void 0, function* () {
        let is_valid = true;
        const options = {
            start: path_to_check,
            //failOn: 'hi;test',
            //json: true,
            direct: Infinity,
            color: false,
        };
        try {
            const licenses = yield checker.init(options);
            const license_regex = new RegExp('MIT|Apache|ISC|WTFPL|BSD|BSD-Source-Code|CC0-1.0|Public Domain|LGPL-2.1-only|CC-BY-*');
            const unhandled_regex = new RegExp('Custom|Unlicense|UNLICENSED');
            for (const [k, v] of Object.entries(licenses)) {
                if (license_regex.exec(v['licenses'])) {
                    globalThis.logger.debug(`${k} has valid license: ${v['licenses']}`);
                }
                else if (unhandled_regex.exec(v['licenses'])) {
                    globalThis.logger.debug(`${k} has unhandled license: ${v['licenses']}`);
                }
                else {
                    globalThis.logger.debug(`${k} has invalid license: ${v['licenses']}`);
                    is_valid = false;
                }
            }
        }
        catch (err) {
            if (err instanceof Error) {
                globalThis.logger.error(`Error while license checking: ${err.message}, stack: ${err.stack}`);
            }
            return false;
        }
        return is_valid;
    });
}
exports.check_licenses_result = check_licenses_result;
//# sourceMappingURL=license_util.js.map