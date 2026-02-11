/*
 * Copyright 2026, Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
