/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { Messages, SfError } from '@salesforce/core';
import {
  Flags,
  loglevel,
  orgApiVersionFlagWithDeprecations,
  requiredOrgFlagWithDeprecations,
  SfCommand,
} from '@salesforce/sf-plugins-core';

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
  public static readonly aliases = ['force:limits:recordcounts:display', 'org:list:sobject:record-counts'];
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    sobject: Flags.string({
      char: 's',
      summary: messages.getMessage('sobjectFlagDescription'),
      aliases: ['sobjecttype'],
      multiple: true,
      default: [],
    }),
    'target-org': requiredOrgFlagWithDeprecations,
    'api-version': orgApiVersionFlagWithDeprecations,
    loglevel,
  };

  public async run(): Promise<RecordCounts> {
    try {
      const { flags } = await this.parse(LimitsRecordCountsDisplayCommand);
      const conn = flags['target-org'].getConnection(flags['api-version']);
      const sobjectsPassed = flags.sobject.map((sobject) => sobject.split(',')).flat();
      const sobjectsQuery = sobjectsPassed.length > 0 ? `=${sobjectsPassed.join()}` : '';
      const geturl = `/limits/recordCount?sObjects${sobjectsQuery}`;
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
