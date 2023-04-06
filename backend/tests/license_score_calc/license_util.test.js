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
const license_util_1 = require("../../controllers/MetricCalculator/license_score_calc/license_util");
//import * as path from 'path';
const sub_process_help = require("../../controllers/MetricCalculator/sub_process_help");
const promisify = require('util.promisify-all');
const checker_orig = require('license-checker');
const checker = promisify(checker_orig);
const logging_setup_1 = require("../../controllers/MetricCalculator/logging_setup");
(0, logging_setup_1.create_logger)();
describe('testing clone_and_install', () => {
    test('clone_and_install succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(sub_process_help, 'run_cmd').mockResolvedValue('stdout');
        expect(yield (0, license_util_1.clone_and_install)('directory', 'url')).toBe(true);
    }));
    test('clone_and_install fails first cmd', () => __awaiter(void 0, void 0, void 0, function* () {
        jest
            .spyOn(sub_process_help, 'run_cmd')
            .mockRejectedValue(new Error('First Error'));
        expect(yield (0, license_util_1.clone_and_install)('directory', 'url')).toBe(false);
    }));
    test('clone_and_install fails second cmd', () => __awaiter(void 0, void 0, void 0, function* () {
        jest
            .spyOn(sub_process_help, 'run_cmd')
            .mockRejectedValue(new Error('First Error'))
            .mockResolvedValueOnce('stdout');
        expect(yield (0, license_util_1.clone_and_install)('directory', 'url')).toBe(false);
    }));
});
describe('testing check_licenses_results', () => {
    test('check_licenses_result error', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(checker, 'init').mockRejectedValue(new Error('Fake Error'));
        expect(yield (0, license_util_1.check_licenses_result)('path')).toBe(false);
    }));
    test('check_licenses_result invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield (0, license_util_1.check_licenses_result)('./tests/_license_checks/extjs-gpl')).toBe(false);
        //console.log(process.cwd());
    }));
    test('check_licenses_result valid', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield (0, license_util_1.check_licenses_result)('./tests/_license_checks/license-checker')).toBe(true);
        //console.log(process.cwd());
    }));
    test('check_licenses_result unhandled', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield (0, license_util_1.check_licenses_result)('./tests/_license_checks/tweetnacl')).toBe(true);
        //console.log(process.cwd());
    }));
});
//# sourceMappingURL=license_util.test.js.map