`use strict`
let repositoryFragment = require(`./fragments/repository.js`).repositoryFragment;

const USER_QUERY = `query ($user_login:String!, $end_cursor:String){
    user(login: $user_login) {
        id
        login
        name
        location
        repositories(first: 10, after: $end_cursor orderBy: {field: PUSHED_AT, direction: DESC}) {
        ... REPOSITORY_FRAGMENT
      }
    }
  }` + repositoryFragment;

  const MS_USERS_QUERY = `query ($end_cursor:String){
    search(query:"microsoft", type:USER, after:$end_cursor, first: 100) { 
      pageInfo {
        endCursor
      }
      nodes {
        ... on User { 
         name 
         email
         company 
         organizations(first: 100) { 
             nodes { 
               name 
             } 
          }
        }
      } 
    }
  }`;

  module.exports = {
    userQuery: USER_QUERY,
    msUsersQuery: MS_USERS_QUERY
  }