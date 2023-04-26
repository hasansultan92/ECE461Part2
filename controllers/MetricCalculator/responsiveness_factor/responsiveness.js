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
exports.get_responsiveness_score = void 0;
const axios = require('axios');
function get_responsiveness_score(github_repo_url) {
    return __awaiter(this, void 0, void 0, function* () {
        const reg = new RegExp('github\\.com/(.+)/(.+)');
        const matches = github_repo_url.match(reg);
        if (matches === null) {
            return 0;
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
        const commitsAdr = 'https://api.github.com/repos/' +
            matches[1] +
            '/' +
            matches[2] +
            '/commits';
        try {
            let commitsData = 0;
            yield axios.get(commitsAdr, config).then((response) => {
                commitsData = response.data;
            });
            let sum = 0;
            let i = 0;
            for (i = 0; i < 30; i++) {
                if (commitsData[i] === undefined) {
                    break;
                }
                const last_commit_date = new Date(commitsData[i].commit.author.date);
                const today = Date.now();
                const diff = Math.abs(Math.round((today - last_commit_date.getTime()) / (1000 * 60 * 60 * 24)));
                sum = sum + diff;
            }
            const average = sum / (i - 1);
            if (average === 0) {
                return 1;
            }
            else {
                const score = 21 / average;
                if (score > 1) {
                    return 1;
                }
                else {
                    return score;
                }
            }
        }
        catch (err) {
            globalThis.logger.error('Error in get_percent_owner ' + err);
        }
        return 0;
    });
}
exports.get_responsiveness_score = get_responsiveness_score;
//# sourceMappingURL=responsiveness.js.map