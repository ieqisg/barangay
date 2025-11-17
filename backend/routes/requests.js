import express from 'express';
import jwt from 'jsonwebtoken';
import Request from '../models/Request.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
async function authenticateToken(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'No account found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
}

// Helper to format request response
function formatRequestResponse(req) {
  return {
    id: req._id.toString(),
    userId: req.userId.toString ? req.userId.toString() : req.userId,
    title: req.title,
    description: req.description,
    type: req.type,
    priority: req.priority,
    status: req.status,
    handler: req.handler ? req.handler.toString() : null,
    createdAt: req.createdAt,
    updatedAt: req.updatedAt,
    logs: req.logs || []
  };
}

/**
 * GET /requests
 * Get all requests or filter by userId
 * Query params: userId (optional)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    const requests = await Request.find(query)
      .populate('userId', 'email firstName lastName')
      .populate('handler', 'email firstName lastName')
      .sort({ createdAt: -1 });

    res.json(requests.map(formatRequestResponse));
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

/**
 * GET /requests/:id
 * Get a specific request by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('userId', 'email firstName lastName')
      .populate('handler', 'email firstName lastName');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(formatRequestResponse(request));
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Failed to fetch request', error: error.message });
  }
});

/**
 * POST /requests
 * Create a new request
 * Body: { title, description, type, priority, authorId }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, priority, authorId } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const request = new Request({
      userId: authorId || req.user._id,
      title,
      description,
      type: type || 'general',
      priority: priority || 'medium'
    });

    await request.save();
    await request.populate('userId', 'email firstName lastName');

    // Create notification for staff
    await Notification.create({
      userId: null, // Global notification for staff
      message: `New request: ${title}`,
      ts: new Date()
    });

    res.status(201).json(formatRequestResponse(request));
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
});

/**
 * PUT /requests/:id/status
 * Update request status
 * Body: { status, actor }
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, actor } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          logs: {
            ts: new Date(),
            actor: actor || req.user.email,
            message: `Status changed to ${status}`
          }
        }
      },
      { new: true }
    ).populate('userId', 'email firstName lastName').populate('handler', 'email firstName lastName');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Notify the request owner
    await Notification.create({
      userId: request.userId._id,
      message: `Your request "${request.title}" is now ${status}`,
      ts: new Date()
    });

    res.json(formatRequestResponse(request));
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

/**
 * PUT /requests/:id/assign
 * Assign handler to request
 * Body: { staffId }
 */
router.put('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: 'Staff ID is required' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        handler: staffId,
        $push: {
          logs: {
            ts: new Date(),
            actor: req.user.email,
            message: `Assigned to ${staffId}`
          }
        }
      },
      { new: true }
    ).populate('userId', 'email firstName lastName').populate('handler', 'email firstName lastName');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(formatRequestResponse(request));
  } catch (error) {
    console.error('Assign handler error:', error);
    res.status(500).json({ message: 'Failed to assign handler', error: error.message });
  }
});

/**
 * POST /requests/:id/logs
 * Add a log entry to request
 * Body: { actor, message }
 */
router.post('/:id/logs', authenticateToken, async (req, res) => {
  try {
    const { actor, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          logs: {
            ts: new Date(),
            actor: actor || req.user.email,
            message
          }
        }
      },
      { new: true }
    ).populate('userId', 'email firstName lastName').populate('handler', 'email firstName lastName');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(formatRequestResponse(request));
  } catch (error) {
    console.error('Add log error:', error);
    res.status(500).json({ message: 'Failed to add log', error: error.message });
  }
});

export default router;
