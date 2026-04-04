const Record = require('../models/Record');

// GET /api/records — all roles see all records
const getAllRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10, search } = req.query;

    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.notes = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Record.countDocuments(filter);
    const records = await Record.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/records/:id
const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate('createdBy', 'name email role');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    res.status(200).json({ success: true, data: { record } });
  } catch (error) {
    next(error);
  }
};

// POST /api/records — admin only
const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await Record.create({
      amount,
      type,
      category,
      date: date || new Date(),
      notes,
      createdBy: req.user._id,
    });

    await record.populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/records/:id — admin only
const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    const { amount, type, category, date, notes } = req.body;
    if (amount !== undefined) record.amount = amount;
    if (type !== undefined) record.type = type;
    if (category !== undefined) record.category = category;
    if (date !== undefined) record.date = date;
    if (notes !== undefined) record.notes = notes;

    await record.save();
    await record.populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/records/:id — admin only, soft delete
const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    record.isDeleted = true;
    record.deletedAt = new Date();
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};