/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect } from 'chai';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { Env } from '@salesforce/kit';
import { ensureString, getString } from '@salesforce/ts-types';
import { RecordCount } from '../../src/commands/limits/recordcounts/display';

describe('recordcounts:display', () => {
  const env = new Env();
  let username: string;
  let testSession: TestSession;

  before('prepare session and ensure environment variables', async () => {
    username = ensureString(env.getString('TESTKIT_HUB_USERNAME'));
    testSession = await TestSession.create({
      devhubAuthStrategy: 'AUTO',
    });
  });

  after(async () => {
    await testSession?.clean();
  });

  it('Displays the records (json)', () => {
    const config = execCmd<RecordCount[]>('config:list', { cli: 'sf', ensureExitCode: 0 });
    // eslint-disable-next-line no-console
    console.log(config);
    const output = execCmd<RecordCount[]>(`limits:recordcounts:display -s Account,Contact -o ${username} --json`, {
      ensureExitCode: 0,
    }).jsonOutput;
    expect(output?.result).length.greaterThan(0);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(output?.result[0].name).equals('Account');
    expect(output?.result.length).equals(2);
    expect(output?.status).to.equal(0);
  });

  it('Displays all records (json)', () => {
    const output = execCmd<RecordCount[]>(`limits:recordcounts:display -u ${username} --json`, {
      ensureExitCode: 0,
    }).jsonOutput;

    expect(output?.result).length.greaterThan(10);
    expect(output?.status).to.equal(0);
  });

  it('Displays the records (human readable)', () => {
    const command = `limits:recordcounts:display -s Account -u ${username}`;
    const result = execCmd(command, { ensureExitCode: 0 });
    const output = getString(result, 'shellOutput.stdout');
    expect(output).to.include('Account');
  });
});
