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
const sub_process_help_1 = require("../controllers/MetricCalculator/sub_process_help");
const logging_setup_1 = require("../controllers/MetricCalculator/logging_setup");
(0, logging_setup_1.create_logger)();
describe('testing run_cmd', () => {
    test('no error', () => __awaiter(void 0, void 0, void 0, function* () {
        const out = yield (0, sub_process_help_1.run_cmd)('echo', ['hi']);
        expect(out).toBeDefined();
    }));
    test('error', () => __awaiter(void 0, void 0, void 0, function* () {
        const out = yield (0, sub_process_help_1.run_cmd)('pwd', ['-x']);
        expect(out).toBeDefined();
    }));
});
//# sourceMappingURL=sub_process_help.test.js.map