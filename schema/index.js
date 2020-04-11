const { buildSchema } = require('graphql');

const schema = buildSchema(`
    scalar Upload

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
        token: String
    }
    type Post {
        id: ID!
        imageUrl: String!
        description: UserType
        likeByUserIds: [User]
    }
    type Query {
        user(id: ID!): User
        login(username: String!, password: String!): User
    }
    type Mutation {
        registerUser(username: String!, email: String!, password: String!, firstName: String!, lastName: String!, bio: String): User
        updateUser(bio: String, firstName: String!, lastName: String!): User
        upload(file: Upload!, description: String): String
    }
`);

module.exports = schema;
