'use strict'

let exceptionHelper = require(`../common/exceptions.js`);

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
    "omri374",
    "rabee333@gmail.com",
    "ilanak",
    "mydiemho",
    "JacopoMangiavacchi",
    "pjlittle",
    "luisamiranda",
  ];
}

function executeQuery(context) {
  var result = context.result;

  hardcodedIds().forEach((id) => {
    result.organizations.push( {
      "login": id,
      "type": "user",
      "collectionSuffix": "DcUsers"
    })}
  );

  context.bindings.githubRepositoriesStep2 = JSON.stringify(result.organizations)
  context.done();  
}

module.exports = function (context) {
  try{

      context.result = {}
      context.result.organizations = [];
      context.result.dcUsers = [];
      context.pageNumber = 0;
      executeQuery(context);
  } catch(error) {
      exceptionHelper.raiseException(error, true, context);
  }
}