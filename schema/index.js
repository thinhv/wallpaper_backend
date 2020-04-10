const { buildSchema } = require('graphql');

const schema = buildSchema(`
    enum UserType {
        admin
        user
    }
    type User {
        id: ID!
        username: String!
        email: String!
        firstName: String!
        lastName: String!
        isVerified: Boolean!
        bio: String
        userType: String!
        profileImageURL: String
        token: String!
    }
    type Post {
        id: ID!
        imageUrl: String!
        description: UserType
        likeByUserIds: [User]
    }
    type Query {
        users: [User!]!
        user(id: Int!): User
        login(username: String!, password: String!): User
    }
    type Mutation {
        registerUser(username: String!, email: String!, password: String!, firstName: String!, lastName: String!, bio: String): User
    }
`);

module.exports = schema;
