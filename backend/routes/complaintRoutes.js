// backend/routes/complaintRoutes.js
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const ctrl = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules for create/update
const createValidators = [
  body('title').isLength({ min: 5, max: 100 }),
  body('description').isLength({ min: 20 }),
  body('category').isIn(['Billing', 'Technical', 'Delivery', 'Other']),
  body('priority').isIn(['Low', 'Medium', 'High', 'Critical']),
  body('customerName').notEmpty(),
  body('customerEmail').isEmail(),
];

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }
  next();
};

// Routes
router.post('/', protect, createValidators, validate, ctrl.createComplaint);
router.get('/', protect, ctrl.listComplaints);
router.get('/:id', protect, ctrl.getComplaint);

// Allow partial updates
router.patch('/:id', protect, ctrl.updateComplaint);

// Soft delete & restore
router.delete('/:id', protect, ctrl.softDeleteComplaint);
router.post('/:id/restore', protect, ctrl.restoreComplaint);

// Optional: status transition
router.patch('/:id/status', protect, ctrl.updateStatus);

module.exports = router;