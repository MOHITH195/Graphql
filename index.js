import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import _db from "./_db.js";

const resolver = {
    Query :{
        Reviews: () => {
            return _db.reviews;
        },
        games: () => {
            return _db.games;
        },
        authors: () => {
            return _db.authors;
        },
        // it contain parent , args and context as arguments
        Review:(_,args) => { // args is an object that contains all the arguments passed to the query
            return _db.reviews.find( (review) => review.id === args.id )
        },
        game:(_,args) => {
            return _db.games.find( (game) => game.id === args.id )
        },
        author:(_,args) => {
            return _db.authors.find( (author) => author.id === args.id )
        }

    },
    
    Game: {
        reviews: (parent) => {
            return _db.reviews.filter(
                (review) => review.game_id === parent.id
            )
        }
    },
    Review:{
        game: (parent) => {
            return _db.games.find(
                (game) => game.id === parent.game_id
            )
        },
        author: (parent) => {
            return _db.authors.find(
                (author) => author.id === parent.author_id
            )
        }
    },
    Author:{
        reviews: (parent) => {
            return _db.reviews.filter(
                (review) => review.author_id === parent.id
            )
        }
    },
    Mutation:{
        deleteGame: (_,args) => {
            _db.games = _db.games.filter(
                (game) => game.id !== args.id
            )
            return _db.games
        },
        addGame:(_, args) => {
            const newGame = {
                id: String(_db.games.length + 1),
                title: args.title,
                platform: args.platform
            }
            _db.games.push(newGame)
            return _db.games
        },
        updateGame: (_,args) => {
            const gameIndex = _db.games.findIndex(
                (game) => game.id === args.id
            )
            if(gameIndex === -1){
                throw new Error("Game not found")
            }
            _db.games[gameIndex] = {
                ..._db.games[gameIndex],
                ...args.input
            }
            return _db.games
        }
    }

}



//  setup ApolloServer
const server = new ApolloServer({
    // typedefs and resolvers expects two functions
    // typedefs -- definitions of types of data
    typeDefs,
    resolvers: resolver // resolvers -- functions that return data for each type of data defined in typedefs  
});

const  test = await startStandaloneServer(server,{
    listen: {
        port: 4000
    }
})

console.log(test)