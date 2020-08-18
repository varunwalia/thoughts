const {buildSchema} = require('graphql');

module.exports  = buildSchema(`

type Post {
    post_id: Int!
    user_id: Int!
    username: String!
    title: String!
    description: String!
    date: String!
    postDate: String!
}

type User {
    user_id: Int!
    username: String!
    email: String!
    password: String 
}

type UserProfile {
    user_id: Int!
    username: String!
}

type AuthData{
    userId: Int!
    token: String!
    tokenExpiration: Int!
}

type Following{
    followed_by: String! 
    follow_who: String!
}


input PostInput {
    user_id: Int!
    title: String!
    description: String! 
}

input UserInput{
    username: String!
    email: String!
    password: String 
}

input FollowInput{
    followed_by: Int! 
    follow_who: Int!
}


type RootQuery{
    posts(user_id: Int!): [Post!]!
    following: [Following!]!
    login (email: String! , password: String!): AuthData!
    users(user_id: Int!): [UserProfile!]!
}

type RootMutation{
    createPost(postInput: PostInput): Post!
    createUser(userInput: UserInput): User! 
    followUser(followInput: FollowInput): Following!
    unfollowUser(followInput: FollowInput): Following
}

schema {
    query: RootQuery
    mutation: RootMutation
} 
` )