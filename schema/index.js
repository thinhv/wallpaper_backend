const { buildSchema } = require('graphql');

const schema = buildSchema(`
    enum UserType {
        admin
        user
    }
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String!
        isVerified: Boolean!
        bio: String
        userType: String!
        profileImageURL: String
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
    }
`);

module.exports = schema;
