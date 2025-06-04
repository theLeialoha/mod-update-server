import { model, Schema, SchemaOptions } from "mongoose";
import { IApiKey, ICounter, IMod, IModUpdate } from "./interfaces";
import { v4 as UUIDv4 } from "uuid";

const ModSchema = new Schema<IMod>({
    modID: { type: String, unique: true, required: true },
    name: { type: String },
    description: { type: String },
    websiteURL: { type: String },
    downloadURL: { type: String },
    issueURL: { type: String },
}, getHideOptions());

const ModUpdateSchema = new Schema<IModUpdate>({
    id: { type: Number, unique: true },
    mod: { type: Schema.Types.ObjectId, ref: "Mods", required: true },
    version: { type: String, required: true },
    modLoader: { type: String, required: true },
    gameVersion: { type: String, required: true },
    releaseType: { type: String, required: true },
    publishDate: { type: Date, default: Date.now },
    updateMessages: [{ type: String }],
    tags: [{ type: String }],
}, getHideOptions());

const ApiKeySchema = new Schema<IApiKey>({
    apiKey: { type: String, default: UUIDv4() },
    mods: [{ type: String }],
}, getHideOptions());

const CounterSchema = new Schema<ICounter>({
    model: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
}, getHideOptions());

// Pre-create
ModUpdateSchema.pre('save', async function (next) {
  if (this.isNew && this.id == null) {
    const counter = await CounterModel.findOneAndUpdate(
      { model: 'ModUpdate' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.count;
  }
  next();
});

export const ModModel = model<IMod>('Mods', ModSchema);
export const CounterModel = model<ICounter>('Counter', CounterSchema);
export const ModUpdateModel = model<IModUpdate>('ModUpdates', ModUpdateSchema);
export const ApiKeyModel = model<IApiKey>('ApiKeys', ApiKeySchema);

function getHideOptions<T>(): SchemaOptions<T> {
    return {
        toJSON: {    
            transform(_, ret) {
                delete ret._id;
                delete ret.__v;
            }
        },
        toObject: {
            transform(_, ret) {
                delete ret._id;
                delete ret.__v;
            }
        },
        strict: true
    }
}
