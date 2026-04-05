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
const { ROLES } = require('../../config/roles');

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records — income and expense transactions
 */

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records
 *     description: Returns paginated records. Supports filtering by type, category, date range, and keyword search. All roles can access.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [salary, freelance, investment, food, transport, utilities, entertainment, healthcare, education, rent, other]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-01-01'
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-03-31'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: salary
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of records with pagination
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
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', protect, authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN), recordFilterRules, validate, getAllRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a single record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record found
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
 *                     record:
 *                       $ref: '#/components/schemas/Record'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', protect, authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN), getRecordById);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record
 *     description: Admin only.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 75000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 enum: [salary, freelance, investment, food, transport, utilities, entertainment, healthcare, education, rent, other]
 *                 example: salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2026-04-01'
 *               notes:
 *                 type: string
 *                 example: April salary payment
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Record created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     record:
 *                       $ref: '#/components/schemas/Record'
 *       403:
 *         description: Forbidden — admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, authorize(ROLES.ADMIN), createRecordRules, validate, createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a financial record
 *     description: Admin only. All fields optional.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 80000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *                 enum: [salary, freelance, investment, food, transport, utilities, entertainment, healthcare, education, rent, other]
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *                 example: Updated notes
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Record updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     record:
 *                       $ref: '#/components/schemas/Record'
 *       403:
 *         description: Forbidden — admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', protect, authorize(ROLES.ADMIN), updateRecordRules, validate, updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete a financial record
 *     description: Soft deletes a record. Admin only.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Record deleted successfully (soft delete)
 *       403:
 *         description: Forbidden — admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteRecord);

module.exports = router;