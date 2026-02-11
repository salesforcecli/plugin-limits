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
