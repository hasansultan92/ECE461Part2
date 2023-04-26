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
exports.get_urls = exports.get_github_url = exports.get_npm_package_name = exports.check_if_github = exports.check_if_npm = exports.read_file = void 0;
const fs_1 = require("fs");
const readline_1 = require("readline");
const getPackageGithubUrl = require('get-package-github-url');
//https://levelup.gitconnected.com/how-to-read-a-file-line-by-line-in-javascript-48d9a688fe49
function read_file(filepath) {
    return new Promise((resolve, reject) => {
        const stream = (0, fs_1.createReadStream)(filepath);
        const rl = (0, readline_1.createInterface)({
            input: stream,
            crlfDelay: Infinity,
        });
        //errors from fs.createReadStream are caught in readline
        rl.on('error', (err) => {
            reject(err);
        });
        const urls = [];
        rl.on('line', (line) => {
            urls.push(line);
        });
        rl.on('close', () => {
            resolve(urls);
        });
    });
}
exports.read_file = read_file;
function check_if_npm(url) {
    const reg = new RegExp('npmjs\\.com/package/(?:[A-Za-z0-9_]*-*)+');
    return reg.test(url);
}
exports.check_if_npm = check_if_npm;
function check_if_github(url) {
    const reg = new RegExp('github\\.com/(?:[A-Za-z0-9_]*-*)+/(?:[A-Za-z0-9_]*-*)+');
    return reg.test(url);
}
exports.check_if_github = check_if_github;
function get_npm_package_name(url) {
    const reg = new RegExp('npmjs\\.com/package/((?:[A-Za-z0-9_]*-*)+)');
    const result = url.match(reg);
    if (result) {
        return result[1];
    }
    else {
        return '';
    }
}
exports.get_npm_package_name = get_npm_package_name;
function get_github_url(package_name) {
    return getPackageGithubUrl(package_name);
}
exports.get_github_url = get_github_url;
// export async function _get_urls(
//   filepath: string
// ): Promise<Promise<URL_PARSE>[] | undefined> {
//   try {
//     const unparsed_urls = await exports.read_file(filepath);
//     if ('map' in unparsed_urls) {
//       const urls = unparsed_urls.map(async (url: string) => {
//         const url_parse: URL_PARSE = {
//           original_url: url,
//           github_repo_url: '',
//         };
//         if (exports.check_if_npm(url)) {
//           const package_name = exports.get_npm_package_name(url);
//           if (package_name) {
//             const potential_repo = await exports.get_github_url(package_name);
//             if (potential_repo) {
//               if (exports.check_if_github(potential_repo)) {
//                 url_parse.github_repo_url = potential_repo;
//               }
//             }
//           }
//         } else if (exports.check_if_github(url)) {
//           url_parse.github_repo_url = url;
//         }
//         return url_parse;
//       });
//       return urls;
//     } else {
//       return undefined; // try-catch means can never be here
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       globalThis.logger.error(`_get_urls: ${err.message}, stack: ${err.stack}`);
//     }
//   }
//   return undefined;
// }
// export async function get_urls(filepath: string): Promise<URL_PARSE[]> {
//   const data: Promise<URL_PARSE>[] | undefined = await exports._get_urls(
//     filepath
//   );
//   if (data) {
//     const final_data: URL_PARSE[] = [];
//     for await (const url_parse of data) {
//       final_data.push(url_parse);
//     }
//     console.log(final_data);
//     return final_data;
//   } else {
//     return [];
//   }
// }
function get_urls(urlInput) {
    return __awaiter(this, void 0, void 0, function* () {
        if (urlInput) {
            const url_parse = {
                original_url: urlInput,
                github_repo_url: '',
            };
            if (exports.check_if_npm(urlInput)) {
                const package_name = exports.get_npm_package_name(urlInput);
                if (package_name) {
                    const potential_repo = yield exports.get_github_url(package_name);
                    if (potential_repo) {
                        if (exports.check_if_github(potential_repo)) {
                            url_parse.github_repo_url = potential_repo;
                        }
                    }
                }
            }
            else if (exports.check_if_github(urlInput)) {
                url_parse.github_repo_url = urlInput;
            }
            const final_data = [];
            final_data.push(url_parse);
            console.log(final_data);
            return final_data;
        }
        else {
            return [];
        }
    });
}
exports.get_urls = get_urls;
//# sourceMappingURL=url_parser.js.map