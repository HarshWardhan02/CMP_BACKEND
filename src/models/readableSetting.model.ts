import { Document, Model, model, Schema } from "mongoose"
const readableSchema = new Schema<ReadableSettingDocument, ReadableSettingModel>({
    idType:{
        type: String,
        required: true
    },
    prefix: {
        type: String
    },
    year: {
      type: String,
      required: true
    },
    month: {
        type: String,
        required: true
    },
    currentNumber: {
      type: Number,
      required: true,
      default: 1000
    }
});

export interface ReadableSetting {
    idType: string;
    prefix: string;
    year: string;
    month: string;
    currentNumber: number;
}

export interface ReadableSettingDocument extends ReadableSetting, Document {
}
export interface ReadableSettingModel extends Model<ReadableSettingDocument> {
}
export default model<ReadableSettingDocument, ReadableSettingModel>("ReadableSetting", readableSchema)


