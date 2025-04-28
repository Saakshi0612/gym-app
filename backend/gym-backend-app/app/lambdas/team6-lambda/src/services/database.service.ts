import mongoose from "mongoose";
import { MONGO_URI } from "../config/constant";


export class DatabaseService {
    private static instance: DatabaseService;
    private isConnected = false

    private constructor() { }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }


    async connect(): Promise<void> {
        if (this.isConnected) {
            return
        }

        try {
            const mongoUri = MONGO_URI;

            if (!mongoUri) {
                throw new Error('MONGODB_URI environment variable is not defined');
            }

            mongoose.set('strictQuery', false)

            await mongoose.connect(mongoUri)

            this.isConnected = true
            console.info('Connected to MongoDB')
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error as Error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.info('Disconnected from MongoDB');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error as Error);
            throw error;
        }
    }
}