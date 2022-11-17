# description

display record counts for the specified standard and custom objects\nUse this command to get an approximate count of the records in standard or custom objects in your org. These record counts are the same as the counts listed in the Storage Usage page in Setup. The record counts are approximate because they're calculated asynchronously and your org's storage usage isn't updated immediately. To display all available record counts, run the command without the '--sobjecttype' parameter.",

# examples

- <%= config.bin %> <%= command.id %>
- <%= config.bin %> <%= command.id %> --sobject Account --sobject Contact,Lead,Opportunity
- <%= config.bin %> <%= command.id %> --sobject Account,Contact --target-org me@my.org

# sobjectFlagDescription

comma-separated list of API names of standard or custom objects for which to display record counts

# targetOrg

Login username or alias for the target org.
