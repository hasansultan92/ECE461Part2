import {join} from 'path';

import {create_tmp, delete_dir} from './license_fs';
import {clone_and_install, check_licenses_result} from './license_util';

export async function get_license_score(): Promise<number> {
  const tmp_dir: string = await create_tmp();
  // note: 'package' is const in local_file_creation, should move for less duplication
  const path_to_check = join(tmp_dir, 'package');

  const success = await clone_and_install(
    tmp_dir,
    'git@github.com:davglass/license-checker.git'
  );
  if (!success) {
    console.log('Unable to analyze local files for licenses');
    delete_dir(tmp_dir);
    return 0;
  }
  const is_valid = await check_licenses_result(path_to_check);
  console.log(is_valid);

  const score = is_valid ? 1 : 0;

  delete_dir(tmp_dir);
  return score;
}

//get_license_score().then((data: number) => {
//  console.log(data);
//});
