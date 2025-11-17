import express from 'express';
import jwt from 'jsonwebtoken';
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

/**
 * GET /notifications
 * Get notifications for current user
 * Query params: userId (optional, defaults to current user)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;
    const targetUserId = userId || req.user._id.toString();

    // Get notifications for this user OR global staff notifications
    const notifications = await Notification.find({
      $or: [
        { userId: targetUserId },
        { userId: null } // Global notifications
      ]
    }).sort({ ts: -1 });

    res.json(notifications.map(n => ({
      id: n._id.toString(),
      userId: n.userId ? n.userId.toString() : null,
      message: n.message,
      read: n.read,
      ts: n.ts
    })));
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});

/**
 * PUT /notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      id: notification._id.toString(),
      userId: notification.userId ? notification.userId.toString() : null,
      message: notification.message,
      read: notification.read,
      ts: notification.ts
    });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
});

export default router;
