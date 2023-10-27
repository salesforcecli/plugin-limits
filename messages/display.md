# summary

Display information about limits in your org.

# description

For each limit, this command returns the maximum allocation and the remaining allocation based on usage. See this topic for a description of each limit: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_limits.htm.

# examples

- Display limits in your default org:

  <%= config.bin %> <%= command.id %>

- Display limits in the org with alias "my-scratch-org":

  <%= config.bin %> <%= command.id %> --target-org my-scratch-org
