import mongoose, { Schema, Document } from 'mongoose';

// Interface to represent a user document in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// User Schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Model creation
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
