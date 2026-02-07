const bcrypt = require("bcryptjs");
const User = require('./userModel'); // Adjust the path as necessary

const seedAdminAndManager = async () => {
  const users = [
    {
      username: 'admin',
      email: 'admin@nativehotels.co.in',
      password: 'admin123', // Use strong passwords in production
      role: 'admin',
    },
    {
      username: 'manager',
      email: 'manager@nativehotels.co.in',
      password: 'manager123', // Use strong passwords in production
      role: 'manager',
    },
  ];

  for (const user of users) {
    try {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
          username: user.username,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        });
        console.log(`${user.role} created: ${user.email}`);
      } else {
        console.log(`${user.role} already exists: ${user.email}`);
      }
    } catch (error) {
      console.error(`Error creating ${user.role}:`, error);
    }
  }
};

module.exports = seedAdminAndManager;