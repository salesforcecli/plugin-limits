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

// import { parseJson } from '@salesforce/kit';
import { ApiLimits } from '../../src/commands/org/list/limits.js';

describe('force:limits:api:display', () => {
  const $$ = new TestContext();

  async function prepareStubs() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    $$.SANDBOX.stub(Org.prototype, 'getConnection').returns(Connection.prototype);
    $$.SANDBOX.stub(Connection.prototype, 'request').resolves({
      AnalyticsExternalDataSizeMB: {
        Max: 40_960,
        Remaining: 40_960,
      },
      BOZosCalloutHourlyLimit: {
        Max: 20_000,
        Remaining: 20_000,
      },
      ConcurrentAsyncGetReportInstances: {
        Max: 200,
        Remaining: 200,
      },
    });
  }

  it('queries and aggregates data correctly', () => {
    it('displays the expected limits correctly', async () => {
      await prepareStubs();
      const result = await runCommand<ApiLimits>('force:limits:api:display');
      const expected = [
        {
          name: 'AnalyticsExternalDataSizeMB',
          max: 40_960,
          remaining: 40_960,
        },
        {
          name: 'BOZosCalloutHourlyLimit',
          max: 20_000,
          remaining: 20_000,
        },
        {
          name: 'ConcurrentAsyncGetReportInstances',
          max: 200,
          remaining: 200,
        },
      ];
      expect(result).to.deep.equal(expected);
    });

    // test
    //   .do(() => prepareStubs())
    //   .stdout()
    //   .command(['force:limits:api:display', '--json'])
    //   .it('displays the expected limits correctly', (ctx) => {
    //     // only chose a subset of the actual returned data for brevity
    //     const expected = [
    //       {
    //         name: 'AnalyticsExternalDataSizeMB',
    //         max: 40_960,
    //         remaining: 40_960,
    //       },
    //       {
    //         name: 'BOZosCalloutHourlyLimit',
    //         max: 20_000,
    //         remaining: 20_000,
    //       },
    //       {
    //         name: 'ConcurrentAsyncGetReportInstances',
    //         max: 200,
    //         remaining: 200,
    //       },
    //     ];

    //     const result = parseJson(ctx.stdout) as ApiLimits;
    //     expect(result).to.deep.equal(expected);
    //   });
  });
});
