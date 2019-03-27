`use strict`

const REPOSITORY_QUERY = `query ($repository_owner:String!, $repository_name:String!, $end_cursor:String ){
    repository( owner : $repository_owner, name : $repository_name) {
        watchers {
            totalCount
        }
        issues {
            totalCount
        }
        owner {
            login
            id
        }
        forkCount
        parent { nameWithOwner }
        stargazers {
            totalCount
        }
        defaultBranchRef {
           target {
               ... on Commit {
                   id
                   history(first: 100, after: $end_cursor) {
                         pageInfo {
                            endCursor
                            hasNextPage
                        }
                        edges {
                           node {
                               committedDate
                               url
                               messageHeadline
                               oid
                               message
                               author {
                                 user {
                                    id
                                    login
                                    name
                                    location
                                }
                              }
                           }
                       }
                   }
               }
           }
       }
   }
}`;

const COLLABORATED_REPOSITORY_QUERY = `query($login:String!, $end_cursor:String) {
    user(login: $login) {
      contributedRepositories(first: 100, after: $end_cursor) {
        pageInfo {
            endCursor
            hasNextPage
        }
        nodes {
          owner{
            login
          }
        } 
      }
    }
  }`

  const CONTRIBUTIONS_REPOSITORY_QUERY = 
  `query($login:String!, $end_cursor:String) {
    user(login: $login) {
    	repositoriesContributedTo(first: 20, after: $end_cursor, includeUserRepositories: true) {
            pageInfo { 
                hasNextPage
                endCursor
              }
            nodes {
                id
                name
                nameWithOwner
                languages(first: 10) { nodes {name } }
                isFork
                forkCount
                stargazers { totalCount }
                issues { totalCount }
                watchers { totalCount }
                createdAt
                pushedAt
                pullRequests { totalCount }
                description
                owner { login }
                defaultBranchRef {
                    target {
                    ... on Commit {
                        history(first:100) {
                        edges { node { author { user { login }}}}
                        }
                    }
                    }
                }
                }
            }
        }
    }`

module.exports = {
    repositoryQuery : REPOSITORY_QUERY,
    collaboratedRepositoryQuery: COLLABORATED_REPOSITORY_QUERY,
    contributionsRepositoryQuery: CONTRIBUTIONS_REPOSITORY_QUERY,
}