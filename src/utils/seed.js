require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Record = require('../models/Record');
const connectDB = require('../../config/db');

const seedData = async () => {
  await connectDB();

  // Clean existing data
  await User.deleteMany({});
  await Record.deleteMany({});
  console.log('Cleared existing data.');

  // Create users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@finance.com',
    password: 'admin123',
    role: 'admin',
  });

  const analyst = await User.create({
    name: 'Analyst User',
    email: 'analyst@finance.com',
    password: 'analyst123',
    role: 'analyst',
  });

  const viewer=await User.create({
    name: 'Viewer User',
    email: 'viewer@finance.com',
    password: 'viewer123',
    role: 'viewer',
  });

  console.log('Users created.');

  // Create sample financial records
  const records = [
    { amount: 75000, type: 'income', category: 'salary', date: new Date('2026-01-05'), notes: 'January salary', createdBy: admin._id },
    { amount: 15000, type: 'income', category: 'freelance', date: new Date('2026-01-12'), notes: 'Web design project', createdBy: admin._id },
    { amount: 5000, type: 'expense', category: 'rent', date: new Date('2026-01-01'), notes: 'Office rent', createdBy: admin._id },
    { amount: 2000, type: 'expense', category: 'utilities', date: new Date('2026-01-10'), notes: 'Electricity & internet', createdBy: admin._id },
    { amount: 3500, type: 'expense', category: 'food', date: new Date('2026-01-15'), notes: 'Team lunch and snacks', createdBy: admin._id },
    { amount: 75000, type: 'income', category: 'salary', date: new Date('2026-02-05'), notes: 'February salary', createdBy: admin._id },
    { amount: 8000, type: 'income', category: 'investment', date: new Date('2026-02-20'), notes: 'Stock dividends', createdBy: analyst._id },
    { amount: 1200, type: 'expense', category: 'transport', date: new Date('2026-02-08'), notes: 'Cab and fuel', createdBy: admin._id },
    { amount: 4500, type: 'expense', category: 'entertainment', date: new Date('2026-02-14'), notes: 'Team outing', createdBy: admin._id },
    { amount: 75000, type: 'income', category: 'salary', date: new Date('2026-03-05'), notes: 'March salary', createdBy: admin._id },
    { amount: 20000, type: 'income', category: 'freelance', date: new Date('2026-03-18'), notes: 'API development contract', createdBy: analyst._id },
    { amount: 6000, type: 'expense', category: 'healthcare', date: new Date('2026-03-22'), notes: 'Team health checkup', createdBy: admin._id },
    { amount: 9000, type: 'expense', category: 'education', date: new Date('2026-03-28'), notes: 'Online course subscriptions', createdBy: admin._id },
    { amount: 9000, type: 'expense', category: 'education', date: new Date('2026-03-28'), notes: 'Online course subscriptions', createdBy: viewer._id }
  ];

  await Record.insertMany(records);
  console.log('Sample records created.');

  console.log('\n=== Seed Complete ===');
  console.log('Admin:    admin@finance.com    / admin123');
  console.log('Analyst:  analyst@finance.com  / analyst123');
  console.log('Viewer:   viewer@finance.com   / viewer123');

  mongoose.disconnect();
};

seedData().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
