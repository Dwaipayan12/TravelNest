const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,  // Ensure description is required to match Joi schema
  },
  image: {
    filename: {
      type: String,
      required: true, // Ensure filename is required to match Joi schema
      default: 'listingimage',
    },
    url: {
      type: String,
      required: true, // Ensure URL is required to match Joi schema
      default: 'https://images.unsplash.com/photo-1714905532906-0b9ec1b22dfa?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      set: (v) => v === '' ? 'https://images.unsplash.com/photo-1714905532906-0b9ec1b22dfa?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : v,
    },
  },
  price: {
    type: Number,
    required: true, // Ensure price is required to match Joi schema
    min: 0,
  },
  location: {
    type: String,
    required: true, // Ensure location is required to match Joi schema
  },
  country: {
    type: String,
    required: true, // Ensure country is required to match Joi schema
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

