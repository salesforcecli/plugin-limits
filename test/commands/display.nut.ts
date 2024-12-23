/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect } from 'chai';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { ensureString, getString } from '@salesforce/ts-types';

export type ListApiDisplayOutput = {
  status: number;
  result: Array<Record<string, unknown>>;
};

describe('Limits display', () => {
  let username: string;
  let testSession: TestSession;

  before('prepare session and ensure environment variables', async () => {
    username = ensureString(process.env.TESTKIT_HUB_USERNAME);
    testSession = await TestSession.create({
      devhubAuthStrategy: 'AUTO',
    });
  });

  after(async () => {
    await testSession?.clean();
  });

  it('Displays the limits (json)', () => {
    const output = execCmd<ListApiDisplayOutput>(`org:list:limits -o ${username} --json`, {
      ensureExitCode: 0,
    }).jsonOutput;
    expect(output?.result).length.greaterThan(0);
    expect(output?.status).to.equal(0);
  });

  it('Displays the limits (human readable)', () => {
    const command = `org:list:limits -o ${username}`;
    const result = execCmd(command, { ensureExitCode: 0 });
    const output = getString(result, 'shellOutput.stdout');
    expect(output).to.include('ActiveScratchOrgs');
  });
});
