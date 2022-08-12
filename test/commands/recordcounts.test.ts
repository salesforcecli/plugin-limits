/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { Connection, Org } from '@salesforce/core';
import { $$, test, expect } from '@salesforce/command/lib/test';

describe('force:limits:recordcounts:display', () => {
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
    test
      .do(() => prepareStubs())
      .stdout()
      .command(['force:limits:recordcounts:display', '--sobjecttype', 'Account,Contact', '--json'])
      .it('displays the expected results correctly', (ctx) => {
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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const result = JSON.parse(ctx.stdout).result;
        expect(result).to.deep.equal(expected);
      });
  });
  it('will add flag option if 0 counted returned', () => {
    test
      .do(() => prepareStubs())
      .stdout()
      .command(['force:limits:recordcounts:display', '--sobjecttype', 'Account,Contact,Lead', '--json'])
      .it('displays the expected results correctly', (ctx) => {
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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const result = JSON.parse(ctx.stdout).result;
        expect(result).to.deep.equal(expected);
      });
  });
});
