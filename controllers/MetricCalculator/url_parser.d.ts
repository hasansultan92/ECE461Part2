export interface URL_PARSE {
    original_url: string;
    github_repo_url: string;
}
export declare function read_file(filepath: string): Promise<string[] | ReferenceError>;
export declare function check_if_npm(url: string): boolean;
export declare function check_if_github(url: string): boolean;
export declare function get_npm_package_name(url: string): string;
export declare function get_github_url(package_name: string): Promise<string | null>;
export declare function get_urls(urlInput: string): Promise<URL_PARSE[]>;
