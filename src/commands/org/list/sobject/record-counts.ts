/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Messages, SfError } from '@salesforce/core';
import {
  arrayWithDeprecation,
  loglevel,
  orgApiVersionFlagWithDeprecations,
  requiredOrgFlagWithDeprecations,
  SfCommand,
} from '@salesforce/sf-plugins-core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-limits', 'recordcounts');

export type RecordCount = {
  name: string;
  count: number;
};

export type RecordCounts = RecordCount[];

type Result = {
  sObjects: RecordCounts;
};

export class LimitsRecordCountsDisplayCommand extends SfCommand<RecordCounts> {
  public static readonly aliases = ['force:limits:recordcounts:display', 'limits:recordcounts:display'];
  public static readonly deprecateAliases = true;
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    sobject: arrayWithDeprecation({
      char: 's',
      summary: messages.getMessage('flags.sobject.summary'),
      aliases: ['sobjecttype'],
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
      const sobjectsQuery = flags.sobject.length > 0 ? `=${flags.sobject.join()}` : '';
      const geturl = `/limits/recordCount?sObjects${sobjectsQuery}`;
      const result = await conn.request<Result>(geturl);

      const recordCounts = result.sObjects
        .filter((record) => (flags.sobject.length > 0 ? flags.sobject.includes(record.name) : result.sObjects))
        .sort((a, b) => a.name.localeCompare(b.name));

      this.table({
        data: recordCounts,
        columns: [
          {
            key: 'name',
            name: 'sObject',
          },
          {
            key: 'count',
            name: 'Record Count',
          },
        ],
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
