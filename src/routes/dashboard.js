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

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Analytics and summary data for the finance dashboard
 */

/**
 * @swagger
 * /api/dashboard/recent-activity:
 *   get:
 *     summary: Get recent transactions
 *     description: Returns the most recently added financial records. All roles can access.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent activity returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     records:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Record'
 */
router.get('/recent-activity', protect, authorize('viewer', 'analyst', 'admin'), getRecentActivity);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary
 *     description: Returns total income, total expenses, and net balance. Analyst and Admin only.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 268000
 *                     totalExpenses:
 *                       type: number
 *                       example: 31200
 *                     netBalance:
 *                       type: number
 *                       example: 236800
 *       403:
 *         description: Forbidden — analyst or admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/summary', protect, authorize('analyst', 'admin'), getSummary);

/**
 * @swagger
 * /api/dashboard/category-totals:
 *   get:
 *     summary: Get totals grouped by category
 *     description: Analyst and Admin only.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *     responses:
 *       200:
 *         description: Category totals returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     categoryTotals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: salary
 *                           type:
 *                             type: string
 *                             example: income
 *                           total:
 *                             type: number
 *                             example: 225000
 *                           count:
 *                             type: integer
 *                             example: 3
 *       403:
 *         description: Forbidden — analyst or admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/category-totals', protect, authorize('analyst', 'admin'), getCategoryTotals);

/**
 * @swagger
 * /api/dashboard/monthly-trends:
 *   get:
 *     summary: Get monthly income and expense trends
 *     description: Analyst and Admin only.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Monthly trends returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: integer
 *                       example: 2026
 *                     trends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             example: 1
 *                           monthName:
 *                             type: string
 *                             example: January
 *                           income:
 *                             type: number
 *                             example: 90000
 *                           expense:
 *                             type: number
 *                             example: 10500
 *       403:
 *         description: Forbidden — analyst or admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/monthly-trends', protect, authorize('analyst', 'admin'), getMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/weekly-trends:
 *   get:
 *     summary: Get last 7 days trends
 *     description: Analyst and Admin only.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly trends returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     weeklyTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                             example: '2026-04-01'
 *                           type:
 *                             type: string
 *                             example: income
 *                           total:
 *                             type: number
 *                             example: 50000
 *                           count:
 *                             type: integer
 *                             example: 1
 *       403:
 *         description: Forbidden — analyst or admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/weekly-trends', protect, authorize('analyst', 'admin'), getWeeklyTrends);

module.exports = router;