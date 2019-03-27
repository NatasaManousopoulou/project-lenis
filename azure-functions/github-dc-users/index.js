'use strict'


let gitHubHelper = require(`../common/githubGraphQL.js`);
let exceptionHelper = require(`../common/exceptions.js`);
let contributionsRepositoryQuery = require(`../common/queries/repository.js`).contributionsRepositoryQuery;

function hardcodedIds() {
  return [
    "NatasaManousopoulou",
    "cloudbeatsch",
    "gfmatthews",
    "niksacdev",
    "syedhassaanahmed",
    "martinpeck",
    "limorl",
    "omri374",
    "lawrencegripper",
    "rabee333",
    "ilanak",
    "mydiemho",
    "JacopoMangiavacchi",
    "pjlittle",
    "luisamiranda",
  ];
}

function executeQuery(context) {
  getContributions(context.login, null, context); 
}

function getContributions(login, endCursor, context) {
  context.log('Getting repos for ' + login);

  context.login = login;
  const variables = JSON.stringify({
    login: login,
    end_cursor: endCursor
  });

  try {
    gitHubHelper.executeQuery(contributionsRepositoryQuery, variables, processResult, context);
  } catch (error) {
    processResult({ error: error }, context);
  }
}

function processResult(graph, context) {
  let result = context.result;

  if (!graph.error) {
    graph.data.user.repositoriesContributedTo.nodes.forEach(repo => {
      result.repos.push(repo); 
      result.user.repos.push(repo.nameWithOwner)
    });

    if (graph.data.user.repositoriesContributedTo.pageInfo.hasNextPage) {
        getContributions(context.login, graph.data.user.repositoriesContributedTo.pageInfo.endCursor, context);
    }
    else {
      context.bindings.dcUserContributionsDocument = JSON.stringify(result.repos);
      context.bindings.dcUsersDocument = JSON.stringify([ result.user ]);
      context.done();
    }      
  }
}

module.exports = function (context, req) {
  try {
      context.pageNumber = 0;

      if (req.query.login || (req.body && req.body.login)) {
        context.login = (req.query.login || req.body.login);
      }
      context.result = { 
        repos: [],
        user: { 
          login: context.login, 
          repos: []
        }
      }
      executeQuery(context);
  } catch(error) {
      exceptionHelper.raiseException(error, true, context);
  }
}