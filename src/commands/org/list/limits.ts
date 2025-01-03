/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Messages, SfError } from '@salesforce/core';
import {
  SfCommand,
  orgApiVersionFlagWithDeprecations,
  loglevel,
  requiredOrgFlagWithDeprecations,
} from '@salesforce/sf-plugins-core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-limits', 'display');

type ApiLimit = {
  name: string;
  max: number;
  remaining: number;
};

type Result = {
  [key: string]: {
    Max: number;
    Remaining: number;
  };
};

export type ApiLimits = ApiLimit[];

export class LimitsApiDisplayCommand extends SfCommand<ApiLimits> {
  public static readonly aliases = ['force:limits:api:display', 'limits:api:display'];
  public static readonly deprecateAliases = true;
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly flags = {
    'target-org': requiredOrgFlagWithDeprecations,
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

      this.table({
        data: limits,
        columns: ['name', 'remaining', 'max'],
      });

      return limits;
    } catch (err) {
      if (err instanceof Error || typeof err === 'string') {
        throw SfError.wrap(err);
      }
      throw err;
    }
  }
}
