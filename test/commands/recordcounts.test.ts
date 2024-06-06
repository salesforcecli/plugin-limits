/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
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
