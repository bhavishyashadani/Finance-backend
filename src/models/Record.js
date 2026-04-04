const mongoose = require('mongoose');

const TYPES = ['income', 'expense'];
const CATEGORIES = [
  'salary',
  'freelance',
  'investment',
  'food',
  'transport',
  'utilities',
  'entertainment',
  'healthcare',
  'education',
  'rent',
  'other',
];

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: { values: TYPES, message: 'Type must be income or expense' },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: `Category must be one of: ${CATEGORIES.join(', ')}` },
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Soft delete support
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries on common filter fields
recordSchema.index({ type: 1, category: 1, date: -1 });
recordSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Record', recordSchema);
