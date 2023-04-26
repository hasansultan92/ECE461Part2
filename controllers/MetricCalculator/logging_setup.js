"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_logger = void 0;
const winston_1 = require("winston");
function get_log_file() {
    const filename = process.env.LOG_FILE;
    if (filename !== undefined) {
        return filename;
    }
    throw new Error('LOG_FILE is not defined');
}
function get_level() {
    const level = process.env.LOG_LEVEL;
    if (level !== undefined) {
        const level_num = Number(level);
        if (level_num === 0) {
            return 'silent';
        }
        if (level_num === 1) {
            return 'info';
        }
        if (level_num === 2) {
            return 'debug';
        }
    }
    throw new Error('LOG_LEVEL is not defined');
}
function create_logger() {
    const level = get_level();
    if (level === 'silent') {
        globalThis.logger = (0, winston_1.createLogger)({
            transports: [],
            level: 'error',
            silent: true,
        });
    }
    else {
        globalThis.logger = (0, winston_1.createLogger)({
            transports: [new winston_1.transports.File({ filename: get_log_file() })],
            level: level,
        });
    }
}
exports.create_logger = create_logger;
//# sourceMappingURL=logging_setup.js.map