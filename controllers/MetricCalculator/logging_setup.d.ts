import { Logger } from 'winston';
declare global {
    var logger: Logger;
}
export declare function create_logger(): void;
