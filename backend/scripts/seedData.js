const mongoose = require('mongoose');
const User = require('../models/user.model.js');
const Computer = require('../models/computer.model.js');
const UsageLog = require('../models/usage_log.model.js');
const ServicePackage = require('../models/service_package.model.js');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/g4_sdn');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Computer.deleteMany({});
    await UsageLog.deleteMany({});
    await ServicePackage.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        username: 'nguyenvana',
        password: 'password123',
        role: 'customer',
        balance: 500000,
        email: 'nguyenvana@example.com'
      },
      {
        username: 'tranthib',
        password: 'password123',
        role: 'customer',
        balance: 300000,
        email: 'tranthib@example.com'
      },
      {
        username: 'lehoangc',
        password: 'password123',
        role: 'customer',
        balance: 700000,
        email: 'lehoangc@example.com'
      }
    ]);

    // Create sample computers
    const computers = await Computer.insertMany([
      {
        computer_name: 'PC-001',
        status: 'available',
        specs: {
          cpu: 'Intel i5-12400F',
          gpu: 'RTX 3060',
          ram: '16GB DDR4',
          storage: '512GB SSD'
        },
        hourly_rate: 50000,
        room: 'VIP Room'
      },
      {
        computer_name: 'PC-002',
        status: 'available',
        specs: {
          cpu: 'Intel i7-12700K',
          gpu: 'RTX 4070',
          ram: '32GB DDR4',
          storage: '1TB SSD'
        },
        hourly_rate: 80000,
        room: 'Gaming Room'
      },
      {
        computer_name: 'PC-003',
        status: 'available',
        specs: {
          cpu: 'AMD Ryzen 5 5600X',
          gpu: 'RTX 4060',
          ram: '16GB DDR4',
          storage: '512GB SSD'
        },
        hourly_rate: 60000,
        room: 'Standard Room'
      },
      {
        computer_name: 'PC-004',
        status: 'in-use',
        specs: {
          cpu: 'Intel i9-12900K',
          gpu: 'RTX 4080',
          ram: '64GB DDR4',
          storage: '2TB SSD'
        },
        hourly_rate: 100000,
        room: 'Premium Room'
      }
    ]);

    // Create sample service packages
    const servicePackages = await ServicePackage.insertMany([
      {
        name: 'Gaming Boost',
        description: 'Enhanced gaming performance package',
        price: 50000,
        isActive: true
      },
      {
        name: 'Streaming Package',
        description: 'Optimized for live streaming',
        price: 75000,
        isActive: true
      }
    ]);

    // Create sample usage logs
    const usageLogs = await UsageLog.insertMany([
      {
        user_id: users[0]._id,
        computer_id: computers[0]._id,
        service_package_id: servicePackages[0]._id,
        start_time: new Date('2025-11-10T10:00:00Z'),
        end_time: new Date('2025-11-10T12:30:00Z'),
        total_time: 150, // 2.5 hours
        cost: 200000, // 50000 * 2.5 + 50000 package
        session_status: 'completed'
      },
      {
        user_id: users[1]._id,
        computer_id: computers[1]._id,
        start_time: new Date('2025-11-11T14:00:00Z'),
        end_time: new Date('2025-11-11T16:00:00Z'),
        total_time: 120, // 2 hours
        cost: 160000, // 80000 * 2
        session_status: 'completed'
      },
      {
        user_id: users[2]._id,
        computer_id: computers[2]._id,
        service_package_id: servicePackages[1]._id,
        start_time: new Date('2025-11-12T09:00:00Z'),
        end_time: null,
        total_time: 60, // 1 hour so far
        cost: 135000, // 60000 + 75000 package
        session_status: 'in-progress'
      },
      {
        user_id: users[0]._id,
        computer_id: computers[1]._id,
        start_time: new Date('2025-11-09T18:00:00Z'),
        end_time: new Date('2025-11-09T20:00:00Z'),
        total_time: 120, // 2 hours
        cost: 160000, // 80000 * 2
        session_status: 'completed'
      },
      {
        user_id: users[1]._id,
        computer_id: computers[0]._id,
        start_time: new Date('2025-11-08T15:00:00Z'),
        end_time: new Date('2025-11-08T17:30:00Z'),
        total_time: 150, // 2.5 hours
        cost: 200000, // 50000 * 2.5 + 50000 package
        session_status: 'completed'
      },
      {
        user_id: users[2]._id,
        computer_id: computers[3]._id,
        service_package_id: servicePackages[0]._id,
        start_time: new Date('2025-11-12T13:00:00Z'),
        end_time: null,
        total_time: 120, // 2 hours so far
        cost: 250000, // 100000 * 2 + 50000 package
        session_status: 'in-progress'
      }
    ]);

    console.log('Sample data seeded successfully!');
    console.log(`Created ${users.length} users, ${computers.length} computers, ${servicePackages.length} service packages, and ${usageLogs.length} usage logs`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedData();