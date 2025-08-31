/*
 * Copyright 2025, Salesforce, Inc.
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
import { Connection, Org } from '@salesforce/core';
import { TestContext } from '@salesforce/core/testSetup';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

describe('force:limits:recordcounts:display', () => {
  const $$ = new TestContext();

  async function prepareStubs() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    $$.SANDBOX.stub(Org.prototype, 'getConnection').returns(Connection.prototype);
    $$.SANDBOX.stub(Connection.prototype, 'request').resolves({
      sObjects: [
        { count: 34, name: 'Account' },
        { count: 116, name: 'Contact' },
      ],
    });
  }

  it('queries and aggregates data correctly', () => {
    it('displays the expected results correctly', async () => {
      await prepareStubs();
      const result = await runCommand('force:limits:recordcounts:display');
      const expected = [
        {
          name: 'Account',
          count: 34,
        },
        {
          name: 'Contact',
          count: 116,
        },
      ];
      expect(result).to.deep.equal(expected);
    });
  });
  it('will add flag option if 0 counted returned', () => {
    it('displays the expected results correctly', async () => {
      await prepareStubs();
      const result = await runCommand('force:limits:recordcounts:display');
      const expected = [
        {
          name: 'Account',
          count: 34,
        },
        {
          name: 'Contact',
          count: 116,
        },
        {
          name: 'Lead',
          count: 0,
        },
      ];
      expect(result).to.deep.equal(expected);
    });
  });
});
