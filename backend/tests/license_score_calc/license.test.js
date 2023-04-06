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
const license_fs = require("../../controllers/MetricCalculator/license_score_calc/license_fs");
const license_util = require("../../controllers/MetricCalculator/license_score_calc/license_util");
const license_1 = require("../../controllers/MetricCalculator/license_score_calc/license");
const logging_setup_1 = require("../../controllers/MetricCalculator/logging_setup");
(0, logging_setup_1.create_logger)();
describe('testing get_license_score', () => {
    jest.spyOn(license_fs, 'delete_dir').mockResolvedValue(undefined);
    test('no error valid', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(license_fs, 'create_tmp').mockResolvedValue('/tmp');
        jest.spyOn(license_util, 'clone_and_install').mockResolvedValue(true);
        jest.spyOn(license_util, 'check_licenses_result').mockResolvedValue(true);
        expect(yield (0, license_1.get_license_score)('url', './tester')).toBe(1);
    }));
    test('tmp dir failed', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(license_fs, 'create_tmp').mockResolvedValue('');
        jest.spyOn(license_util, 'clone_and_install').mockResolvedValue(true);
        jest.spyOn(license_util, 'check_licenses_result').mockResolvedValue(true);
        expect(yield (0, license_1.get_license_score)('url', './tester')).toBe(0);
    }));
    test('clone_and_install error', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(license_fs, 'create_tmp').mockResolvedValue('/tmp');
        jest.spyOn(license_util, 'clone_and_install').mockResolvedValue(false);
        jest.spyOn(license_util, 'check_licenses_result').mockResolvedValue(true);
        expect(yield (0, license_1.get_license_score)('url', './tester')).toBe(0);
    }));
    test('no error not valid', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(license_fs, 'create_tmp').mockResolvedValue('/tmp');
        jest.spyOn(license_util, 'clone_and_install').mockResolvedValue(true);
        jest.spyOn(license_util, 'check_licenses_result').mockResolvedValue(false);
        expect(yield (0, license_1.get_license_score)('url', './tester')).toBe(0);
    }));
});
//# sourceMappingURL=license.test.js.map