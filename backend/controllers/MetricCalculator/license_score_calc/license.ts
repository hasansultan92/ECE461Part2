import {join} from 'path';

import {create_tmp, delete_dir} from './license_fs';
import {clone_and_install, check_licenses_result} from './license_util';

export async function get_license_score(
  repo_url: string,
  tmp_dir: string
): Promise<number> {
  if (tmp_dir === '') {
    return 0;
  }
  // note: 'package' is const in local_file_creation, should move for less duplication
  const path_to_check = join(tmp_dir, 'package');

  //all of the urls are passed into here
  //however clone and install will return false if it is not a valid url otherwise it will allow it to pass through
  const success = await clone_and_install(tmp_dir, repo_url);
  if (!success) {
    globalThis.logger.info('Unable to analyze local files for licenses');
    delete_dir(tmp_dir);
    return 0;
  }
  const is_valid = await check_licenses_result(path_to_check);
  globalThis.logger.info(`license status for ${repo_url}: ${is_valid}`);

  const score = is_valid ? 1 : 0;

  //delete_dir(tmp_dir);
  return score;
}

//get_license_score().then((data: number) => {
//  console.log(data);
//});
