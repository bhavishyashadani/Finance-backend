const express = require('express');
const router = express.Router();

const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklyTrends,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// All roles can see recent activity
router.get('/recent-activity', authorize('viewer', 'analyst', 'admin'), getRecentActivity);

// Only analyst and admin can see deep analytics
router.get('/summary', authorize('analyst', 'admin'), getSummary);
router.get('/category-totals', authorize('analyst', 'admin'), getCategoryTotals);
router.get('/monthly-trends', authorize('analyst', 'admin'), getMonthlyTrends);
router.get('/weekly-trends', authorize('analyst', 'admin'), getWeeklyTrends);

module.exports = router;