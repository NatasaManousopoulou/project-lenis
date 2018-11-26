'use strict'

let gitHubHelper = require(`../common/githubGraphQL.js`);
let exceptionHelper = require(`../common/exceptions.js`);
let msUsersQuery = require(`../common/queries/user.js`).msUsersQuery;



function processResult(graph, context) {
  let result = context.result;
  graph.data.search.nodes.forEach(r => { 
    if (r.email != null && r.email.toLowerCase().trim().endsWith("@microsoft.com"))
      result.msUsers.push(r);
  });
  if(graph.data.search.pageInfo.hasNextPage) {
    executeQuery(result.login, graph.data.search.pageInfo.endCursor, context);
  } else {
    context.bindings.msUsersDocument = JSON.stringify(result)
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