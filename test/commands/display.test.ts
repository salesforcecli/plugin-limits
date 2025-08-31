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
