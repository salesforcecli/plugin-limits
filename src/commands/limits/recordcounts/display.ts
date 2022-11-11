/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-limits', 'recordcounts');

export type RecordCount = {
  name: string;
  count: number;
};

export type RecordCounts = RecordCount[];

interface Result {
  sObjects: RecordCounts;
}

export class LimitsRecordCountsDisplayCommand extends SfCommand<RecordCounts> {
  public static readonly aliases = ['force:limits:recordcounts:display', 'show:recordcounts'];
  public static readonly summary = messages.getMessage('commandDescription');
  public static readonly description = messages.getMessage('commandDescription');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);

  public static flags = {
    'sobject-type': Flags.string({
      char: 's',
      summary: messages.getMessage('sobjecttypeFlagDescription'),
      aliases: ['sobjecttype'],
      multiple: true,
      default: [],
    }),
    'target-org': Flags.requiredOrg({
      char: 'o',
      aliases: ['targetusername', 'u'],
      summary: messages.getMessage('targetOrg'),
    }),
  };

  public async run(): Promise<RecordCounts> {
    try {
      const { flags } = await this.parse(LimitsRecordCountsDisplayCommand);
      const conn = flags['target-org'].getConnection();
      const sobjectsPassed = flags['sobject-type'].map((sobject) => sobject.split(',')).flat();
      const sobjectsQuery = sobjectsPassed.length > 0 ? `=${sobjectsPassed.join()}` : '';
      const geturl = `${conn.baseUrl()}/limits/recordCount?sObjects${sobjectsQuery}`;
      const result = await conn.request<Result>(geturl);

      const recordCounts = result.sObjects
        .filter((record) => (sobjectsPassed.length > 0 ? sobjectsPassed.includes(record.name) : result.sObjects))
        .sort((a, b) => a.name.localeCompare(b.name));

      this.table(recordCounts, {
        name: { header: 'sObject' },
        count: { header: 'Record Count' },
      });
      return recordCounts;
    } catch (err) {
      if (err instanceof Error || typeof err === 'string') {
        throw SfError.wrap(err);
      }
      throw err;
    }
  }
}
