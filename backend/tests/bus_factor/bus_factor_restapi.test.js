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
const bus_factor_restapi_1 = require("../../controllers/MetricCalculator/bus_factor/bus_factor_restapi");
const logging_setup_1 = require("../../controllers/MetricCalculator/logging_setup");
(0, logging_setup_1.create_logger)();
describe('testing get_percent_owner', () => {
    test('should return the percent of commits contributed by the owner', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(!(yield (0, bus_factor_restapi_1.get_percent_owner)('https://github.com/torvalds/linux'))).toBeDefined();
    }));
    test('should return undefined since not github', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield (0, bus_factor_restapi_1.get_percent_owner)('https://github./torvalds/linux')).toBe(undefined);
    }));
});
//# sourceMappingURL=bus_factor_restapi.test.js.map