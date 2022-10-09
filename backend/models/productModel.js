import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, trim: true },
    image: { type: String, required: true },
    images: [String],
    pdfFile: { type: String },
    brand: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.',
});

const Product = mongoose.model('Product', productSchema);
export default Product;
