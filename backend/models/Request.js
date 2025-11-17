import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['general', 'complaint', 'request', 'feedback'],
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['submitted', 'in-progress', 'resolved', 'rejected'],
      default: 'submitted'
    },
    handler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    logs: [
      {
        ts: {
          type: Date,
          default: Date.now
        },
        actor: String,
        message: String
      }
    ]
  },
  { timestamps: true }
);

// Add initial log when request is created
requestSchema.pre('save', function (next) {
  if (this.isNew && (!this.logs || this.logs.length === 0)) {
    this.logs = [
      {
        ts: new Date(),
        actor: 'system',
        message: 'Request submitted'
      }
    ];
  }
  next();
});

// Populate user info when fetching
requestSchema.post('findOne', async function (doc) {
  if (doc) {
    await doc.populate('userId', 'email firstName lastName');
    if (doc.handler) {
      await doc.populate('handler', 'email firstName lastName');
    }
  }
});

requestSchema.post('find', async function (docs) {
  for (const doc of docs) {
    await doc.populate('userId', 'email firstName lastName');
    if (doc.handler) {
      await doc.populate('handler', 'email firstName lastName');
    }
  }
});

export default mongoose.model('Request', requestSchema);
