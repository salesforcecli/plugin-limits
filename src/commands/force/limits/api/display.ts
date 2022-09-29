/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';

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

export class LimitsApiDisplayCommand extends SfdxCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);
  public static readonly requiresUsername = true;

  public async run(): Promise<ApiLimit[]> {
    try {
      const conn = this.org.getConnection();
      const geturl = `${conn.instanceUrl}/services/data/v${conn.version}/limits`;
      const result = await conn.request<Result>(geturl);
      const limits: ApiLimit[] = [];

      Object.keys(result).map((limitName) => {
        limits.push({
          name: limitName,
          max: result[limitName].Max,
          remaining: result[limitName].Remaining,
        });
      });

      this.ux.table(limits, { name: { header: 'Name' }, remaining: { header: 'Remaining' }, max: { header: 'Max' } });

      return limits;
    } catch (err) {
      if (err instanceof Error || typeof err === 'string') {
        throw SfError.wrap(err);
      }
      throw err;
    }
  }
}
