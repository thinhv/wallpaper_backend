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
        profileImageUrl: String
        token: String
    }

    type Post {
        _id: ID!
        imageUrl: String!
        description: String
        likedByUsers: [User]
        postedByUser: User
        likedByMe: Boolean
        createdAt: String
    }

    type Query {
        user(id: ID!): User
        login(username: String!, password: String!): User
        posts(start: Int, limit: Int): [Post]
        post(id: ID): Post
    }

    type Mutation {
        registerUser(username: String!, email: String!, password: String!, firstName: String!, lastName: String!, bio: String): User
        updateUser(bio: String, firstName: String!, lastName: String!): User
        updateUserImage(file: Upload): User
        upload(file: Upload!, description: String): String
        createPost(file: Upload!, description: String): Post
        updatePost(id: String, description: String): Post
        deletePost(id: String): Post
        likePost(id: String): Post
    }
`);

module.exports = schema;
