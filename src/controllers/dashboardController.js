const Record = require('../models/Record');

// All dashboard queries run on ALL records — no user scoping
const baseFilter = { isDeleted: false };

// GET /api/dashboard/summary — analyst, admin
const getSummary = async (req, res, next) => {
  try {
    const [incomeResult, expenseResult] = await Promise.all([
      Record.aggregate([
        { $match: { ...baseFilter, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Record.aggregate([
        { $match: { ...baseFilter, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpenses = expenseResult[0]?.total || 0;
    const netBalance = totalIncome - totalExpenses;

    res.status(200).json({
      success: true,
      data: { totalIncome, totalExpenses, netBalance },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/category-totals — analyst, admin
const getCategoryTotals = async (req, res, next) => {
  try {
    const { type } = req.query;
    const matchFilter = { ...baseFilter };
    if (type) matchFilter.type = type;

    const categoryTotals = await Record.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: { categoryTotals } });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/monthly-trends — analyst, admin
const getMonthlyTrends = async (req, res, next) => {
  try {
    const filterYear = parseInt(req.query.year) || new Date().getFullYear();

    const trends = await Record.aggregate([
      {
        $match: {
          ...baseFilter,
          date: {
            $gte: new Date(`${filterYear}-01-01`),
            $lte: new Date(`${filterYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(filterYear, i, 1).toLocaleString('default', {
        month: 'long',
      }),
      income: 0,
      expense: 0,
    }));

    trends.forEach(({ month, type, total }) => {
      months[month - 1][type] = total;
    });

    res.status(200).json({
      success: true,
      data: { year: filterYear, trends: months },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/recent-activity — all roles
const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const records = await Record.find(baseFilter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, data: { records } });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/weekly-trends — analyst, admin
const getWeeklyTrends = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trends = await Record.aggregate([
      {
        $match: {
          ...baseFilter,
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          day: '$_id.day',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: { weeklyTrends: trends } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklyTrends,
};