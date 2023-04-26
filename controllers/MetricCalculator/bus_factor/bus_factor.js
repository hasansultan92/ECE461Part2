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
exports.get_bus_factor_score = void 0;
const bus_factor_restapi_1 = require("./bus_factor_restapi");
const bus_factor_graphql_1 = require("./bus_factor_graphql");
function get_bus_factor_score(github_repo_url) {
    return __awaiter(this, void 0, void 0, function* () {
        const [percent_owner, number_forks] = yield Promise.all([
            (0, bus_factor_restapi_1.get_percent_owner)(github_repo_url),
            (0, bus_factor_graphql_1.get_number_forks)(github_repo_url),
        ]);
        let score = 0;
        if (typeof percent_owner === 'number') {
            score += 0.75 * percent_owner;
        }
        globalThis.logger.info(`bus_factor percent_owner score ${score}`);
        if (typeof number_forks === 'number') {
            if (number_forks > 0) {
                score += 0.25 * (1 - 1 / number_forks);
            }
        }
        globalThis.logger.info(`bus_factor score ${score}`);
        return score;
    });
}
exports.get_bus_factor_score = get_bus_factor_score;
//# sourceMappingURL=bus_factor.js.map