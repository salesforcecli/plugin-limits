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
