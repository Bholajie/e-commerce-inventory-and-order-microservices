import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export const Item = mongoose.model<IItem>('Item', ItemSchema);