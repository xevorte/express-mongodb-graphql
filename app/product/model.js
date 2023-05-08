import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name of Product must be filled'],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      maxLength: [225, 'Description length must between 4 - 225 Characters'],
      minLength: [4, 'Description length must between 4 - 225 Characters'],
      required: [true, 'Description must be filled'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock must be filled'],
    },
    price: {
      type: Number,
      required: [true, 'Price must be filled'],
    },
    status: {
      type: String,
      enum: ['active', 'nonactive'],
      default: 'active',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
