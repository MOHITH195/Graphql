export const typeDefs = `#graphql

type Game{
    id:ID!,  # id is a required field
    title:String,
    platform:[String!]!, # platform is a required field and is an array of strings
    reviews:[Review] # reviews is an array of Review type

}

type Review {
    id:ID!,
    rating:Int!,
    content:String!,
    game:Game,
    author:Author
}

type Author {
    id:ID!,
    name:String!,
    verified:Boolean!,
    reviews:[Review]
}

type Query {
    Reviews:[Review]
    games:[Game]
    authors:[Author]
    Review(id:ID!):Review
    game(id:ID!):Game
    author(id:ID!):Author
}


type Mutation {
    deleteGame(id:ID!):[Game]
    addGame(title:String!, platform:[String!]!):[Game]
    updateGame(id:ID!, input:upadateGame!):[Game]
}

input upadateGame{
    title:String,
    platform:[String!]
}

`