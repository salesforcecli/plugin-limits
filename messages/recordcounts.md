# summary

Display record counts for the specified standard or custom objects.

# description

Use this command to get an approximate count of the records in standard or custom objects in your org. These record counts are the same as the counts listed in the Storage Usage page in the Setup UI. The record counts are approximate because they're calculated asynchronously and your org's storage usage isn't updated immediately. To display all available record counts, run the command without the --sobject flag.

# examples

- Display all available record counts in your default org:

  <%= config.bin %> <%= command.id %>

- Display record counts for the Account, Contact, Lead, and Opportunity objects in your default org:

  <%= config.bin %> <%= command.id %> --sobject Account --sobject Contact --sobject Lead --sobject Opportunity

- Display record counts for the Account and Lead objects for the org with alias "my-scratch-org":

  <%= config.bin %> <%= command.id %> --sobject Account --sobject Lead --target-org my-scratch-org

# flags.sobject.summary

API name of the standard or custom object for which to display record counts.
