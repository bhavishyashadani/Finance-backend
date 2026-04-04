const express = require('express');
const router = express.Router();

const {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/auth');
const {
  createRecordRules,
  updateRecordRules,
  recordFilterRules,
  validate,
} = require('../middleware/validators');

router.use(protect);

// All roles can view records
router.get('/', authorize('viewer', 'analyst', 'admin'), recordFilterRules, validate, getAllRecords);
router.get('/:id', authorize('viewer', 'analyst', 'admin'), getRecordById);

// Only admin can create, update, delete
router.post('/', authorize('admin'), createRecordRules, validate, createRecord);
router.put('/:id', authorize('admin'), updateRecordRules, validate, updateRecord);
router.delete('/:id', authorize('admin'), deleteRecord);

module.exports = router;