'use strict'

let gitHubHelper = require(`../common/githubGraphQL.js`);
let exceptionHelper = require(`../common/exceptions.js`);
let msUsersQuery = require(`../common/queries/user.js`).msUsersQuery;

function isMicrosoftOrg(organization) {
  return 
    organization != null &&
    organization != undefined &&
    [ "microsoft", "azure", "azure-samples", "microsoftdocs", "dotnetcore", "dotnet" ].find((v) => v == organization.name.toLowerCase());
}

function processResult(graph, context) {
  let result = context.result;
  graph.data.search.nodes.forEach(r => { 
    if ((r.email != null && r.email.toLowerCase().trim().endsWith("@microsoft.com")) ||
        (r.company != null && r.company.toLowerCase().indexOf("microsoft" >= 0)) ||
        (r.organizations != null && r.organizations.nodes != null && r.organizations.nodes.some(isMicrosoftOrg))) {
      delete r.organizations;
      r.id = r.email;
      r.repositories = r.repositories.nodes.map((n) => n.nameWithOwner);
      result.msUsers.push(r);
    }
  });

  context.log(graph.data.search.nodes.length);
  context.log(graph.data.search.pageInfo.endCursor);

  if(graph.data.search.pageInfo.endCursor != null) {
    executeQuery(graph.data.search.pageInfo.endCursor, context);
  } else {
    context.bindings.msUsersDocument = JSON.stringify(result.msUsers)
    context.done();
  }
}

function executeQuery(endCursor, context) {
  const variables = JSON.stringify({
    end_cursor: endCursor
  });
  gitHubHelper.executeQuery(msUsersQuery, variables, processResult, context);
}

module.exports = function (context) {
  try{
      context.result = {}
      context.result.msUsers = [];
      executeQuery(null, context);
  } catch(error) {
      exceptionHelper.raiseException(error, true, context);
  }
}