
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 5, maxlength: 100 },
    description: { type: String, required: true, minlength: 20 },
    category: {
      type: String,
      enum: ['Billing', 'Technical', 'Delivery', 'Other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, match: /.+@.+\..+/ },

    
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    status: {
      type: String,
      enum: ['New', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Reopened'],
      default: 'New',
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);


ComplaintSchema.pre(/^find/, function (next) {
  if (!this.getQuery().includeDeleted) {
    this.where({ deletedAt: null });
  } else {
    
    const q = this.getQuery();
    delete q.includeDeleted;
  }
  next();
});


ComplaintSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Complaint', ComplaintSchema);
