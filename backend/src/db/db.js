const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

function isPlaceholderMongoUri(uri) {
    if (!uri) return true;

    return uri.includes('YOUR VALUE') ||
        uri.includes('<username>') ||
        uri.includes('<password>') ||
        uri.includes('<cluster-url>') ||
        uri.includes('127.0.0.1:27017') ||
        uri.includes('localhost:27017');
}

async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    let mongoUri = process.env.MONGO_URI;

    if (isPlaceholderMongoUri(mongoUri)) {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        console.log('No real MongoDB URI was provided. Using in-memory MongoDB server for development.');
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('Database connected successfully');
    } catch (error) {
        if (!mongoServer && (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'))) {
            mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            console.log('Falling back to in-memory MongoDB server');
            await mongoose.connect(mongoUri);
            console.log('Database connected successfully');
            return;
        }

        console.error('Database connection error:', error);
        throw error;
    }
}

module.exports = connectDB;