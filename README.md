# plugin-limits

[![NPM](https://img.shields.io/npm/v/@salesforce/plugin-limits.svg?label=@salesforce/plugin-limits)](https://www.npmjs.com/package/@salesforce/plugin-limits) [![Downloads/week](https://img.shields.io/npm/dw/@salesforce/plugin-limits.svg)](https://npmjs.org/package/@salesforce/plugin-limits) [![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/license/apache-2-0)

A command to display the api limits of your org

This plugin is bundled with the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli). For more information on the CLI, read the [getting started guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm).

We always recommend using the latest version of these commands bundled with the CLI, however, you can install a specific version or tag if needed.

## Install

```bash
sfdx plugins:install limits@x.y.z
```

## Issues

Please report any issues at https://github.com/forcedotcom/cli/issues

## Contributing

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress.
3. Fork this repository.
4. [Build the plugin locally](#build)
5. Create a _topic_ branch in your fork. Note, this step is recommended but technically not required if contributing using a fork.
6. Edit the code in your fork.
7. Write appropriate tests for your changes. Try to achieve at least 95% code coverage on any new code. No pull request will be accepted without unit tests.
8. Sign CLA (see [CLA](#cla) below).
9. Send us a pull request when you are done. We'll review your code, suggest any needed changes, and merge it in.

### CLA

External contributors will be required to sign a Contributor's License
Agreement. You can do so by going to https://cla.salesforce.com/sign-cla.

### Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone git@github.com:salesforcecli/plugin-limits

# Install the dependencies and compile
yarn install
yarn build
```

To use your plugin, run using the local `./bin/dev` or `./bin/dev.cmd` file.

```bash
# Run using local run file.
./bin/dev force:limits
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sfdx cli
sfdx plugins:link .
# To verify
sfdx plugins
```

## Commands

<!-- commands -->

- [`sf org list limits`](#sf-org-list-limits)
- [`sf org list sobject record-counts`](#sf-org-list-sobject-record-counts)

## `sf org list limits`

Display information about limits in your org.

```
USAGE
  $ sf org list limits -o <value> [--json] [--flags-dir <value>] [--api-version <value>]

FLAGS
  -o, --target-org=<value>   (required) Username or alias of the target org. Not required if the `target-org`
                             configuration variable is already set.
      --api-version=<value>  Override the api version used for api requests made by this command

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Display information about limits in your org.

  For each limit, this command returns the maximum allocation and the remaining allocation based on usage. See this
  topic for a description of each limit:
  https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_limits.htm.

ALIASES
  $ sf force limits api display
  $ sf limits api display

EXAMPLES
  Display limits in your default org:

    $ sf org list limits

  Display limits in the org with alias "my-scratch-org":

    $ sf org list limits --target-org my-scratch-org
```

_See code: [src/commands/org/list/limits.ts](https://github.com/salesforcecli/plugin-limits/blob/3.3.76/src/commands/org/list/limits.ts)_

## `sf org list sobject record-counts`

Display record counts for the specified standard or custom objects.

```
USAGE
  $ sf org list sobject record-counts -o <value> [--json] [--flags-dir <value>] [-s <value>...] [--api-version <value>]

FLAGS
  -o, --target-org=<value>   (required) Username or alias of the target org. Not required if the `target-org`
                             configuration variable is already set.
  -s, --sobject=<value>...   [default: ] API name of the standard or custom object for which to display record counts.
      --api-version=<value>  Override the api version used for api requests made by this command

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Display record counts for the specified standard or custom objects.

  Use this command to get an approximate count of the records in standard or custom objects in your org. These record
  counts are the same as the counts listed in the Storage Usage page in the Setup UI. The record counts are approximate
  because they're calculated asynchronously and your org's storage usage isn't updated immediately. To display all
  available record counts, run the command without the --sobject flag.

ALIASES
  $ sf force limits recordcounts display
  $ sf limits recordcounts display

EXAMPLES
  Display all available record counts in your default org:

    $ sf org list sobject record-counts

  Display record counts for the Account, Contact, Lead, and Opportunity objects in your default org:

    $ sf org list sobject record-counts --sobject Account --sobject Contact --sobject Lead --sobject Opportunity

  Display record counts for the Account and Lead objects for the org with alias "my-scratch-org":

    $ sf org list sobject record-counts --sobject Account --sobject Lead --target-org my-scratch-org
```

_See code: [src/commands/org/list/sobject/record-counts.ts](https://github.com/salesforcecli/plugin-limits/blob/3.3.76/src/commands/org/list/sobject/record-counts.ts)_

<!-- commandsstop -->
