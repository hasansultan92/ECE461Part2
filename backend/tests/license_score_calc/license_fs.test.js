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
const license_fs_1 = require("../../controllers/MetricCalculator/license_score_calc/license_fs");
// imports to mock
const os = require("os");
const fs = require("fs/promises");
const path = require("path");
const logging_setup_1 = require("../../controllers/MetricCalculator/logging_setup");
(0, logging_setup_1.create_logger)();
//import {tmpdir} from 'os';
//import {rm, mkdtemp} from 'fs/promises';
//import {join} from 'path';
//jest.mock('os', () => ({
//  __esModule: true,
//  ...jest.requireActual('os'),
//  tmpdir: () => jest.fn(),
//}));
//jest.mock('fs/promises', () => ({
//  __esModule: true,
//  ...jest.requireActual('fs/promises'),
//  rm: () => jest.fn(),
//}));
//jest.mock('os');
describe('testing create_tmp', () => {
    jest.spyOn(os, 'tmpdir').mockReturnValue('/tmp');
    jest.spyOn(path, 'join').mockImplementation((str1, str2) => {
        return str1 + '/' + str2;
    });
    test('should return tmp_dir', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(fs, 'mkdtemp').mockImplementation((str1) => {
            return new Promise((resolve, reject) => {
                resolve(str1 + 'asdf');
            });
        });
        const result = yield (0, license_fs_1.create_tmp)();
        expect(result).toBe('/tmp/npm-package-data-asdf');
    }));
    test('should return empty string from failure', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(fs, 'mkdtemp').mockImplementation((str1) => {
            return new Promise((resolve, reject) => {
                reject(new Error('Fake error'));
            });
        });
        const result = yield (0, license_fs_1.create_tmp)();
        expect(result).toBe('');
    }));
});
describe('testing delete_dir', () => {
    test('should call rm on valid directory', () => __awaiter(void 0, void 0, void 0, function* () {
        jest
            .spyOn(fs, 'rm')
            .mockImplementation((str1, options) => {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        });
        const result = yield (0, license_fs_1.delete_dir)('/tmp');
        expect(result).toBe(undefined);
    }));
    test('should call rm on invalid directory', () => __awaiter(void 0, void 0, void 0, function* () {
        jest
            .spyOn(fs, 'rm')
            .mockImplementation((str1, options) => {
            return new Promise((resolve, reject) => {
                reject(new Error('Fake Error'));
            });
        });
        const result = yield (0, license_fs_1.delete_dir)('/tmp');
        expect(result).toBe(undefined);
    }));
});
//# sourceMappingURL=license_fs.test.js.map