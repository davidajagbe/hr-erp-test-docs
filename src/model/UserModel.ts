import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  id: string;
  name: string;
  age: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);