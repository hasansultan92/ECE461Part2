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
exports.get_percent_owner = void 0;
const axios = require('axios');
function get_percent_owner(github_repo_url) {
    return __awaiter(this, void 0, void 0, function* () {
        const reg = new RegExp('github\\.com/(.+)/(.+)');
        const matches = github_repo_url.match(reg);
        if (matches === null) {
            return undefined;
        }
        if (process.env.GITHUB_TOKEN === undefined) {
            throw new Error('GITHUB_TOKEN is not defined');
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'bearer ' + process.env.GITHUB_TOKEN,
                'User-Agent': 'Node',
            },
        };
        const repoAdr = 'https://api.github.com/repos/' + matches[1] + '/' + matches[2];
        const commitsAdr = 'https://api.github.com/repos/' +
            matches[1] +
            '/' +
            matches[2] +
            '/commits';
        try {
            let repoData = 0;
            yield axios.get(repoAdr, config).then((response) => {
                repoData = response.data;
            });
            let commitsData = 0;
            yield axios.get(commitsAdr, config).then((response) => {
                commitsData = response.data;
            });
            //globalThis.logger.debug('get_number_contributors query: ' + repo.data);
            const owner = repoData.owner.id;
            let ownerCommits = 0;
            let otherCommits = 0;
            for (let i = 0; i < 30; i++) {
                if (commitsData[i] === undefined) {
                    break;
                }
                if (commitsData[i].author.id === owner) {
                    ownerCommits += 1;
                }
                else {
                    otherCommits += 1;
                }
            }
            const percentOwner = ownerCommits / (ownerCommits + otherCommits);
            return percentOwner;
        }
        catch (err) {
            if (err instanceof Error) {
                globalThis.logger.error('Error in get_percent_owner ' + err.message);
            }
        }
        return undefined;
    });
}
exports.get_percent_owner = get_percent_owner;
//# sourceMappingURL=bus_factor_restapi.js.map