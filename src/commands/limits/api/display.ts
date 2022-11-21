/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand, orgApiVersionFlagWithDeprecations, loglevel } from '@salesforce/sf-plugins-core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-limits', 'display');

type ApiLimit = {
  name: string;
  max: number;
  remaining: number;
};

interface Result {
  [key: string]: {
    Max: number;
    Remaining: number;
  };
}

export type ApiLimits = ApiLimit[];

export class LimitsApiDisplayCommand extends SfCommand<ApiLimits> {
  public static aliases = ['force:limits:api:display', 'org:list:limits'];
  public static readonly summary = messages.getMessage('description');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);
  public static flags = {
    'target-org': Flags.requiredOrg({
      char: 'o',
      aliases: ['targetusername', 'u'],
      summary: messages.getMessage('targetOrg'),
    }),
    'api-version': orgApiVersionFlagWithDeprecations,
    loglevel,
  };

  public async run(): Promise<ApiLimits> {
    try {
      const { flags } = await this.parse(LimitsApiDisplayCommand);
      const conn = flags['target-org'].getConnection(flags['api-version']);
      const result = await conn.request<Result>('/limits');
      const limits: ApiLimits = Object.entries(result).map(([name, { Max, Remaining }]) => ({
        name,
        max: Max,
        remaining: Remaining,
      }));

      this.table(limits, { name: { header: 'Name' }, remaining: { header: 'Remaining' }, max: { header: 'Max' } });

      return limits;
    } catch (err) {
      if (err instanceof Error || typeof err === 'string') {
        throw SfError.wrap(err);
      }
      throw err;
    }
  }
}
