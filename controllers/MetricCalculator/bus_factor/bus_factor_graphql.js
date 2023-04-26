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
exports.get_number_forks = void 0;
const https_1 = require("https");
function get_number_forks(github_repo_url) {
    return __awaiter(this, void 0, void 0, function* () {
        const reg = new RegExp('github\\.com/(.+)/(.+)');
        const matches = github_repo_url.match(reg);
        if (matches === null) {
            return undefined;
        }
        if (process.env.GITHUB_TOKEN === undefined) {
            throw new Error('GITHUB_TOKEN is not defined');
        }
        //https://stepzen.com/blog/consume-graphql-in-javascript
        // code using https request example
        const data = JSON.stringify({
            query: `{
      repository(name: "${matches[2]}", owner: "${matches[1]}") {
        id
        forks {
          totalCount
        }
      }
    }
    `,
        });
        globalThis.logger.debug('get_number_forks query: ' + data);
        const options = {
            hostname: 'api.github.com',
            path: '/graphql',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                Authorization: 'bearer ' + process.env.GITHUB_TOKEN,
                'User-Agent': 'Node',
            },
        };
        const do_request = (options, data) => {
            return new Promise((resolve, reject) => {
                const req = (0, https_1.request)(options, res => {
                    res.setEncoding('utf8');
                    let data = '';
                    globalThis.logger.debug(`get_number_forks: statusCode: ${res.statusCode}`);
                    res.on('data', d => {
                        data += d;
                    });
                    res.on('end', () => {
                        resolve(JSON.parse(data));
                    });
                });
                req.on('error', (error) => {
                    reject(error);
                });
                req.write(data);
                req.end();
            });
        };
        try {
            const return_value = yield do_request(options, data);
            globalThis.logger.debug('get_number_forks response: ' + JSON.stringify(return_value, null, 2));
            return return_value.data.repository.forks.totalCount;
        }
        catch (err) {
            if (err instanceof Error) {
                globalThis.logger.error(`get_number_forks error: ${err.message}, stack: ${err.stack}`);
            }
        }
        return undefined;
    });
}
exports.get_number_forks = get_number_forks;
//# sourceMappingURL=bus_factor_graphql.js.map