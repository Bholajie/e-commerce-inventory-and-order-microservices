import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  sku: string;
  quantity: number;
  status: 'PENDING' | 'FULFILLED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['PENDING', 'FULFILLED', 'FAILED'],
    default: 'PENDING'
  }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);