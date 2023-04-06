import {run_cmd} from '../controllers/MetricCalculator/sub_process_help';
import * as child_process from 'child_process';
import {create_logger} from '../controllers/MetricCalculator/logging_setup';

create_logger();

describe('testing run_cmd', () => {
  test('no error', async () => {
    const out: string | ReferenceError = await run_cmd('echo', ['hi']);
    expect(out).toBeDefined();
  });
  test('error', async () => {
    const out: string | ReferenceError = await run_cmd('pwd', ['-x']);
    expect(out).toBeDefined();
  });
});
