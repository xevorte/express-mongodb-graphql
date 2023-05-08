import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: [225, 'Name length must between 4 - 225 Characters'],
      minLength: [4, 'Name length must between 4 - 225 Characters'],
      required: [true, 'Name must be filled'],
    },
    description: {
      type: String,
      minLength: [4, 'Name length must between 4 - 225 Characters'],
      default: 'No Description',
    },
    type: {
      type: String,
      enum: ['Individual', 'Group', 'Company'],
      default: 'Company',
    },
    sizeOfMembers: {
      type: Number,
      default: 1,
    },
    address: {
      type: String,
      required: [true, 'Address must be filled'],
    },
    contact: {
      type: String,
      required: [true, 'Contact must be filled'],
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
