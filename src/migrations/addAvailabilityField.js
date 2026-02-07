const mongoose = require("mongoose");
const SeminarHall = require("../models/seminarHallModel");

const updateSeminarHalls = async () => {
  try {
    // Use your actual database name here
    const dbUrl = "mongodb://localhost:27017/native"; // or whatever your db name is
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");

    // Log the current connection details
    console.log("Connected to database:", mongoose.connection.name);

    // First check the collection name
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));

    // Find all seminar halls and log them
    const halls = await SeminarHall.find({});
    console.log(`Found ${halls.length} halls in the database`);
    
    if (halls.length > 0) {
      console.log("Sample hall:", halls[0]); // Log a sample hall
    }

    const result = await SeminarHall.updateMany(
      {}, // Update all documents
      { $set: { isAvailable: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} seminar halls`);
    console.log(`Matched ${result.matchedCount} seminar halls`);

    // Verify the update
    const updatedHalls = await SeminarHall.find();
    console.log("Number of halls after update:", updatedHalls.length);

    process.exit(0);
  } catch (error) {
    console.error("Error updating seminar halls:", error);
    process.exit(1);
  }
};

updateSeminarHalls();