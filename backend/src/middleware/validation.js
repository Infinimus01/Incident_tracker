const { body, param, query, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules for creating an incident
const createIncidentValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  
  body('service')
    .trim()
    .notEmpty().withMessage('Service is required')
    .isLength({ max: 100 }).withMessage('Service must not exceed 100 characters'),
  
  body('severity')
    .notEmpty().withMessage('Severity is required')
    .isIn(['SEV1', 'SEV2', 'SEV3', 'SEV4']).withMessage('Severity must be one of: SEV1, SEV2, SEV3, SEV4'),
  
  body('status')
    .optional()
    .isIn(['OPEN', 'MITIGATED', 'RESOLVED']).withMessage('Status must be one of: OPEN, MITIGATED, RESOLVED'),
  
  body('owner')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Owner must not exceed 100 characters'),
  
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Summary must not exceed 5000 characters'),
  
  validate
];

// Validation rules for updating an incident
const updateIncidentValidation = [
  param('id')
    .isUUID().withMessage('Invalid incident ID format'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  
  body('service')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Service must not exceed 100 characters'),
  
  body('severity')
    .optional()
    .isIn(['SEV1', 'SEV2', 'SEV3', 'SEV4']).withMessage('Severity must be one of: SEV1, SEV2, SEV3, SEV4'),
  
  body('status')
    .optional()
    .isIn(['OPEN', 'MITIGATED', 'RESOLVED']).withMessage('Status must be one of: OPEN, MITIGATED, RESOLVED'),
  
  body('owner')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Owner must not exceed 100 characters'),
  
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Summary must not exceed 5000 characters'),
  
  validate
];

// Validation rules for getting incident by ID
const getIncidentByIdValidation = [
  param('id')
    .isUUID().withMessage('Invalid incident ID format'),
  
  validate
];

// Validation rules for query parameters
const getIncidentsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('severity')
    .optional()
    .isIn(['SEV1', 'SEV2', 'SEV3', 'SEV4']).withMessage('Invalid severity value'),
  
  query('status')
    .optional()
    .isIn(['OPEN', 'MITIGATED', 'RESOLVED']).withMessage('Invalid status value'),
  
  query('sortBy')
    .optional()
    .isIn(['created_at', 'updated_at', 'title', 'severity', 'status', 'service']).withMessage('Invalid sortBy field'),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc']).withMessage('sortOrder must be ASC or DESC'),
  
  validate
];

module.exports = {
  createIncidentValidation,
  updateIncidentValidation,
  getIncidentByIdValidation,
  getIncidentsValidation
};