const { body, query, param, validationResult } = require('express-validator');

// Helper: run validations and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validations
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Role must be viewer, analyst, or admin'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Record validations
const createRecordRules = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('category')
    .isIn(['salary', 'freelance', 'investment', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'rent', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

const updateRecordRules = [
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category')
    .optional()
    .isIn(['salary', 'freelance', 'investment', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'rent', 'other'])
    .withMessage('Invalid category'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('notes').optional().trim().isLength({ max: 500 }),
];

// User management validations (admin)
const updateUserRules = [
  body('role')
    .optional()
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Role must be viewer, analyst, or admin'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
];

// Record filter query validations
const recordFilterRules = [
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('category')
    .optional()
    .isIn(['salary', 'freelance', 'investment', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'rent', 'other']),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  createRecordRules,
  updateRecordRules,
  updateUserRules,
  recordFilterRules,
};
