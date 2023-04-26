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
exports.delete_dir = exports.create_tmp = void 0;
const os_1 = require("os");
const promises_1 = require("fs/promises");
const path_1 = require("path");
//https://blog.mastykarz.nl/create-temp-directory-app-node-js/
function create_tmp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tmpDir = yield (0, promises_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), 'npm-package-data-'));
            globalThis.logger.info(`Created temp folder: ${tmpDir}`);
            return tmpDir;
        }
        catch (err) {
            if (err instanceof Error) {
                globalThis.logger.info('temp folder creation failed');
            }
        }
        return '';
    });
}
exports.create_tmp = create_tmp;
function delete_dir(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (directory) {
                yield (0, promises_1.rm)(directory, { recursive: true, force: true });
            }
        }
        catch (err) {
            globalThis.logger.error(`deleting directory ${directory} failed`);
        }
    });
}
exports.delete_dir = delete_dir;
//# sourceMappingURL=license_fs.js.map