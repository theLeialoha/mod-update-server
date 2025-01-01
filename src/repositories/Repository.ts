import { List, Optional } from "../types/java";
import { MongoClient, Db, Collection, Document } from 'mongodb';
import * as url from 'url';

interface Cache<T> {
    [key: string]: T;
}

class BaseRepository<T> {
    private static ready: boolean = false;
    protected static client: Promise<MongoClient>;
    protected static database: Promise<Db>;
    protected static counter: Collection;

    protected cache: Cache<T> = {};
    protected collection!: Collection<T & Document>;
    protected syncInterval!: NodeJS.Timeout;

    // Shared MongoClient instance across all repositories
    constructor(protected collectionName: string) {
        if (BaseRepository.client == undefined)
            BaseRepository.createClient();

        // Wait for Database
        BaseRepository.database.then(database => {
            this.collection = database.collection<T & Document>(collectionName);
            this.syncInterval = setInterval(() => this.loadData(), 30 * 1000); // Sync every 30 seconds
            this.loadData();
        });
    }

    // Create the connection to MongoDB
    private static createClient(): Promise<MongoClient> {
        if (this.client != undefined) return this.client;

        const password = process.env.DB_PASSWORD ? encodeURIComponent(process.env.DB_PASSWORD).replace(/%2F/g, '%252F') : undefined;
        const auth = process.env.DB_USERNAME ? (process.env.DB_USERNAME + (password ? `:${password}` : '')) : undefined;

        const clientUrl = url.format({
            protocol: 'http', auth,
            hostname: process.env.DB_HOSTNAME,
            port: process.env.DB_PORT,
        }).replace(/^http/i, process.env.DB_PROTOCOL || 'mongodb');

        console.log(`Connecting to: ${clientUrl}`);

        this.client = new MongoClient(clientUrl).connect();
        this.database = this.client.then(client => client.db(process.env.DB_NAME));
        this.database.then((database) => {
            this.counter = database.collection('counters');
            this.ready = true;
        });

        return this.client;
    }

    protected async saveNextSequenceValue(): Promise<void> {
        await BaseRepository.counter.findOneAndUpdate(
            { collection: this.collectionName }, // Using the collection name as the sequence
            { $inc: { sequence_value: 1 } }, // Increment the counter
            { /** returnDocument: 'after', **/ upsert: true } // Create the counter if it doesn't exist
        );
    }

    // Load data from MongoDB into memory cache
    private async loadData(): Promise<void> {
        const data = await this.collection.find().toArray();
        data.forEach((item) => this.cache[item['_id'].toString()] = (item as T) );
    }

    // Close the client when done
    public static close(): void {
        this.client.then(client => {
            clearInterval(this.prototype.syncInterval);
            client.close();
        });
    }

    get isReady() {
        return BaseRepository.ready;
    }

}

// Example of extending the repository for a specific collection (e.g., Users)
export class ManagedRepository<T> extends BaseRepository<T> {

    private sequenceValue: number = 1;

    constructor(collectionName: string) {
        super(collectionName);
        
        ManagedRepository.database.then(() => {
            ManagedRepository.counter.findOne({ collection: this.collectionName })
                .then(value => value ? this.sequenceValue = value.sequence_value : null);
        });
    }

    // Save data to MongoDB and update cache
    public insertOne(data: T): any {
        const id = this.nextSequenceValue;
        const createdData: any = data;
        createdData._id = id;
        this.collection.insertOne(createdData);
        this.cache[id.toString()] = data;
        return data;
    }

    // Retrieve all data from cache
    public findAll(): List<T> {
        return Object.values(this.cache);
    }

    // Check if id exists in cache
    public existsById(id: string): boolean {
        return this.cache[id] != null;
    }

    // Retrieve data from cache (with fallback to DB)
    public findById(id: string): Optional<T> {
        return this.cache[id] || null;
    }

    // Retrieve data from cache (with fallback to DB)
    public updateById(id: string, update: T): Optional<T> {
        if (this.cache[id] == undefined) return null;

        // We don't want to override the id
        delete (update as any)._id;

        for (const key in this.cache[id]) {
            if (update[key] != undefined)
                this.cache[id][key] = update[key];
        }

        this.collection.updateOne({ _id: id as any }, { $set: this.cache[id] as any });
        return this.cache[id];
    }

    // Remove data from MongoDB and update cache
    public async deleteById(id: string) {
        delete this.cache[id];
        await this.collection.deleteOne({ _id: id as any });
    }

    // Get count of entries from cache
    public count(): number {
        return this.findAll().length;
    }

    protected get nextSequenceValue() {
        this.saveNextSequenceValue();
        return this.sequenceValue++;
    }
}

export class Pageable {

    readonly page: number;
    readonly amount: number;

    private constructor(page: number, amount: number) {
        this.page = page;
        this.amount = amount;
    }

    static of(page: number, amount: number): Pageable {
        return new Pageable(page, amount);
    }
}
