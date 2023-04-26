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
exports.get_license_score = void 0;
const path_1 = require("path");
const license_fs_1 = require("./license_fs");
const license_util_1 = require("./license_util");
function get_license_score(repo_url, tmp_dir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tmp_dir === '') {
            return 0;
        }
        // note: 'package' is const in local_file_creation, should move for less duplication
        const path_to_check = (0, path_1.join)(tmp_dir, 'package');
        //all of the urls are passed into here
        //however clone and install will return false if it is not a valid url otherwise it will allow it to pass through
        const success = yield (0, license_util_1.clone_and_install)(tmp_dir, repo_url);
        if (!success) {
            globalThis.logger.info('Unable to analyze local files for licenses');
            (0, license_fs_1.delete_dir)(tmp_dir);
            return 0;
        }
        const is_valid = yield (0, license_util_1.check_licenses_result)(path_to_check);
        globalThis.logger.info(`license status for ${repo_url}: ${is_valid}`);
        const score = is_valid ? 1 : 0;
        //delete_dir(tmp_dir);
        return score;
    });
}
exports.get_license_score = get_license_score;
//get_license_score().then((data: number) => {
//  console.log(data);
//});
//# sourceMappingURL=license.js.map