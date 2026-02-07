const mongoose = require("mongoose");
const BanquetHall = require("../models/banquetHallModel");

// Seed banquet halls into the existing SeminarHall collection (schema-compatible)
const banquetHalls = [
  {
    name: "Ivory Banquet Hall",
    capacity: 150,
    details: "Every celebration must overflow with grandeur and outstanding services. Our Ivory banquet is the perfect venue for your Special gatherings and get-togethers, so every memory created is an everlasting one.",
    images: [
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Ivory-Hall-1.jpg",
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Ivory-Hall-4.jpg",
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Ivory-Hall-3.jpg"
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Excellent", available: true, quantity: 2 },
      { name: "Sound System", type: "AV", condition: "Excellent", available: true, quantity: 2 },
      { name: "Podium", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Stage Lighting", type: "Lighting", condition: "Good", available: true, quantity: 1 },
      { name: "LED Wall", type: "AV", condition: "Excellent", available: true, quantity: 4 },
      { name: "AC", type: "HVAC", condition: "Excellent", available: true, quantity: 4 },
    ],
  },
  {
    name: "Ebony Banquet Hall",
    capacity: 300,
    details: "When luxury meets celebration, it creates moments of blissful eternity. Our Ebony banquet is best suited venue for your grand soirees, formal meet-ups or any large gatherings. Laced with the best amenities and features, you can be sure to turn your any event into a luxury statement.",
    images: [
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Ebony-Hall-2.jpg",
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Ebony-Hall-4.jpg",
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Ebony-Hall-3.jpg"

    ],
    equipment: [
      { name: "Podium", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Stage Lighting", type: "AV", condition: "Good", available: true, quantity: 4 },
      { name: "Sound System", type: "AV", condition: "Good", available: true, quantity: 2 },
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 2 },
      { name: "Whiteboard", type: "AV", condition: "Good", available: true, quantity: 2 },
      { name: "AC", type: "HVAC", condition: "Good", available: true, quantity: 2 },
    ],
  },
  {
    name: "Pearl Banquet Hall",
    capacity: 40,
    details: "Elegant and intimate banquet hall perfect for smaller gatherings and corporate events.",
    images: [
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Pearl-Hall-5.jpg",
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Pearl-Hall-4.jpg",
      "https://www.nativehotels.co.in/wp-content/uploads/2024/09/Pearl-Hall-3.jpg"
    ],
    equipment: [
      { name: "Chandeliers", type: "Lighting", condition: "Excellent", available: true, quantity: 2 },
      { name: "Podium", type: "Staging", condition: "Excellent", available: true, quantity: 1 },
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 2 },
      { name: "AC", type: "HVAC", condition: "Excellent", available: true, quantity: 4 },
      { name: "LED TVs", type: "AV", condition: "Excellent", available: true, quantity: 2 },
      { name: "Microphone", type: "AV", condition: "Good", available: true, quantity: 4 },
    ],
  },
  {
    name: "Sapphire Banquet Hall",
    capacity: 220,
    details: "Modern banquet hall with modular seating and breakout areas.",
    images: [
      "https://www.theparkhotels.com/images/site-specific/corporate-site/banquets/banquets-banner.jpg",
      
    ],
    equipment: [
      { name: "Projector", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Sound System", type: "AV", condition: "Good", available: true, quantity: 1 },
      { name: "Podium", type: "Staging", condition: "Good", available: true, quantity: 1 },
      { name: "Microphone", type: "AV", condition: "Good", available: true, quantity: 2 },
    ],
  },
  {
    name: "Opal Conference & Banquet",
    capacity: 150,
    details: "Compact hall perfect for intimate functions and conferences.",
    images: [
      "https://lh3.googleusercontent.com/LCIiJbNfZN0z-Shv_IrLIv7S9KaMMeVr3XYQdif2HvsE15rJnXdkd7IutcQl8demABntuZA22n6H3DJ2R5zMh7s=w882-h588-l80-e31",
      "https://assets.simplotel.com/simplotel/image/upload/x_0,y_225,w_1350,h_760,r_0,c_crop,q_80,fl_progressive/w_500,f_auto,c_fit/the-residency-towers-chennai/Senator_Hall_b6lkh4"
    ],
    equipment: [
      { name: "Whiteboard", type: "Stationary", condition: "Good", available: true, quantity: 2 },
      { name: "LED TVs", type: "AV", condition: "Good", available: true, quantity: 2 },
      { name: "AC", type: "HVAC", condition: "Good", available: true, quantity: 2 },
    ],
  },
];

const seedBanquetDatabase = async () => {
  try {
    console.log("Connecting to MongoDB... ");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const existingCount = await BanquetHall.countDocuments();
    if (existingCount > 0) {
      console.log(`BanquetHall already has ${existingCount} documents. Skipping banquet seeding.`);
      return;
    }
    console.log("BanquetHall collection empty. Seeding banquet halls...");

    console.log("Seeding banquet halls into BanquetHall collection...");
    for (const [index, hall] of banquetHalls.entries()) {
      const displayId = index + 1;
      const doc = new BanquetHall({
        name: hall.name,
        displayId,
        capacity: hall.capacity,
        details: hall.details,
        images: hall.images || [],
        equipment: hall.equipment,
      });
      await doc.save();
      console.log(`Seeded: ${hall.name}`);
    }

    console.log("Banquet halls seeding completed");
  } catch (err) {
    console.error("Error during banquet seeding:", err);
  }
};
module.exports = seedBanquetDatabase;