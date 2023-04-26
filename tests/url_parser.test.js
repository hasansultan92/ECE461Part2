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
const url_parser = require("../controllers//MetricCalculator/url_parser");
const logging_setup_1 = require("../controllers/MetricCalculator/logging_setup");
(0, logging_setup_1.create_logger)();
describe('testing readfile', () => {
    test('invalid/nonexistent file', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(url_parser.read_file('asdf')).rejects.toThrow();
    }));
    test('regular_file', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield url_parser.read_file('./tests/_urls/random.txt')).toStrictEqual(['asdf', '']);
    }));
});
describe('testing check_if_npm', () => {
    test('is npmjs', () => {
        expect(url_parser.check_if_npm('https://www.npmjs.com/package/get-package-github-url')).toBe(true);
    });
    test('is not npmjs', () => {
        expect(url_parser.check_if_npm('https://www.npmjs.com/packages/get-package-github-url')).toBe(false);
    });
    test('is npmjs even if params', () => {
        expect(url_parser.check_if_npm('https://www.npmjs.com/package/get-package-github-url?random_param=hi')).toBe(true);
    });
});
describe('testing check_if_github', () => {
    test('is github', () => {
        expect(url_parser.check_if_github('https://github.com/marcofugaro/get-package-github-url')).toBe(true);
    });
    test('is not github', () => {
        expect(url_parser.check_if_github('https://github.co/marcofugaro/get-package-github-url')).toBe(false);
    });
});
describe('testing get_npm_package_name', () => {
    test('npm', () => {
        expect(url_parser.get_npm_package_name('https://www.npmjs.com/package/get-package-github-url')).toBe('get-package-github-url');
    });
    test('npm even if params', () => {
        expect(url_parser.get_npm_package_name('https://www.npmjs.com/package/get-package-github-url?random_param=hi')).toBe('get-package-github-url');
    });
    test('npm not valid', () => {
        expect(url_parser.get_npm_package_name('https://www.npmijs.com/package/get-package-github-u@rl')).toBe('');
    });
});
describe('testing get_github_url', () => {
    test('should work', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield url_parser.get_github_url('get-package-github-url')).toBe('https://github.com/marcofugaro/get-package-github-url');
    }));
    test('should not work', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield url_parser.get_github_url('get-pa-ckage-github-url')).toBe(null);
    }));
});
// describe('testing _get_urls', () => {
//   test('should not work', async () => {
//     expect(await url_parser._get_urls('asdf')).toBe(undefined);
//   });
//   test('should work', async () => {
//     const val = await url_parser._get_urls('./tests/_urls/url_test1.txt');
//     const final: url_parser.URL_PARSE[] = [];
//     if (val) {
//       for await (const url of val) {
//         final.push(url);
//       }
//     }
//     expect(final).toStrictEqual([
//       {
//         github_repo_url: 'https://github.com/jonschlinkert/get-repository-url',
//         original_url: 'https://www.npmjs.com/package/get-repository-url',
//       },
//       {
//         github_repo_url: 'https://github.com/vuongtaquoc/url-parser',
//         original_url: 'https://www.npmjs.com/package/url_parser',
//       },
//       {
//         github_repo_url: 'https://github.com/davglass/license-checker',
//         original_url: 'https://github.com/davglass/license-checker',
//       },
//       {
//         github_repo_url: '',
//         original_url: 'not_a_url',
//       },
//       {
//         github_repo_url: '',
//         original_url:
//           'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences',
//       },
//       {
//         github_repo_url: 'https://github.com/joehewitt/ajax',
//         original_url:
//           'https://www.npmjs.com/package/ajax?activeTab=dependencies',
//       },
//       {
//         github_repo_url: '',
//         original_url: 'https://www.npmjs.com/packages/get-package-github-url',
//       },
//       {
//         github_repo_url: '',
//         original_url: 'https://github.co/marcofugaro/get-package-github-url',
//       },
//     ]);
//   });
// });
// describe('testing get_urls', () => {
//   test('should work get_urls', async () => {
//     const val = await url_parser.get_urls('./tests/_urls/url_test1.txt');
//     expect(val).toStrictEqual([
//       {
//         github_repo_url: 'https://github.com/jonschlinkert/get-repository-url',
//         original_url: 'https://www.npmjs.com/package/get-repository-url',
//       },
//       {
//         github_repo_url: 'https://github.com/vuongtaquoc/url-parser',
//         original_url: 'https://www.npmjs.com/package/url_parser',
//       },
//       {
//         github_repo_url: 'https://github.com/davglass/license-checker',
//         original_url: 'https://github.com/davglass/license-checker',
//       },
//       {
//         github_repo_url: '',
//         original_url: 'not_a_url',
//       },
//       {
//         github_repo_url: '',
//         original_url:
//           'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences',
//       },
//       {
//         github_repo_url: 'https://github.com/joehewitt/ajax',
//         original_url:
//           'https://www.npmjs.com/package/ajax?activeTab=dependencies',
//       },
//       {
//         github_repo_url: '',
//         original_url: 'https://www.npmjs.com/packages/get-package-github-url',
//       },
//       {
//         github_repo_url: '',
//         original_url: 'https://github.co/marcofugaro/get-package-github-url',
//       },
//     ]);
//   });
//   test('should not work', async () => {
//     expect(await url_parser.get_urls('asdf')).toStrictEqual([]);
//   });
//   test('should be empty work', async () => {
//     expect(await url_parser.get_urls('./tests/_urls/empty.txt')).toStrictEqual(
//       []
//     );
//   });
// });
//# sourceMappingURL=url_parser.test.js.map