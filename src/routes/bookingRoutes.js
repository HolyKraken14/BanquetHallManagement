const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const BanquetHall = require("../models/banquetHallModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const sendEmail = require("../models/sendEmail"); // Import the sendEmail function
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rolemiddleware");

// Route to handle the booking request
router.post("/book", async (req, res) => {
  const {
    userId,
    seminarHallId,
    bookingDate,
    startTime,
    endTime,
    eventName,
    eventDetails,
    equipmentRequest,
    eventCoordinators, // Collecting event coordinators
    specialEquipmentRequests,
    pax,
    foodRequired,
    costPerPlate,
    additionalDetails,
  } = req.body;

  if (!seminarHallId || !userId || !bookingDate || !startTime || !endTime || !eventName || !eventDetails) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Banquet validations
  if (pax === undefined || pax === null || Number(pax) <= 0) {
    return res.status(400).json({ message: 'Invalid number of pax' });
  }
  if (foodRequired === true && (costPerPlate === undefined || Number(costPerPlate) < 0)) {
    return res.status(400).json({ message: 'Invalid cost per plate' });
  }

  // Validate if the hall exists
  const hall = await BanquetHall.findById(seminarHallId);
  if (!hall) {
    return res.status(404).json({ message: "Hall not found" });
  }

  // Validate if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check for conflicting bookings in the hall for the given date and time
  const existingBooking = await Booking.findOne({
    seminarHallId,
    bookingDate,
    $or: [
      { startTime: { $lte: endTime }, endTime: { $gte: startTime } }, // Check if there's overlap
    ],
  });
  if(startTime>=endTime){
    return res.status(400).json({message:"Invalid Time Slot"})
  }

  if (existingBooking) {
    return res.status(400).json({ message: "Hall is already booked for this time" });
  }

  // Create new booking with initial status 'pending'
  const newBooking = new Booking({
    userId,
    seminarHallId,
    bookingDate,
    startTime,
    endTime,
    eventName,
    eventDetails,
    eventCoordinators, // Include event coordinators
    specialEquipmentRequests,
    pax: Number(pax),
    foodRequired: Boolean(foodRequired),
    costPerPlate: foodRequired ? Number(costPerPlate) : undefined,
    additionalDetails: additionalDetails || '',
    status: "pending",  // Initial status set to pending
  });

  try {
    await newBooking.save();
    res.status(201).json({ message: "Booking request created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error booking seminar hall", error });
  }
});

// Route for manager to approve booking
router.patch(
  "/:bookingId/approve/manager",
  verifyToken,
  authorizeRoles("manager"), // Only managers can approve
  async (req, res) => {
    const { bookingId } = req.params;

    try {
      const booking = await Booking.findById(bookingId);

      if (!booking || booking.status !== "pending") {
        return res.status(400).json({ message: "Booking not found or not in a pending state." });
      }

      booking.status = "approved_by_manager";
      await booking.save();

      // Send notification
      const user = await User.findById(booking.userId);
      const notification = new Notification({
        userId: user._id,
        message: `Your booking for seminar hall "${booking.seminarHallId}" has been approved.`,
        bookingId,
      });
      await notification.save();

      res.status(200).json({ message: "Booking approved", booking });
    } catch (error) {
      res.status(500).json({ message: "Error approving booking", error });
    }
  }
);


// Route for admin to approve booking

// In the admin approval route, update the email sending logic:
router.patch(
  "/:bookingId/approve/admin",
  verifyToken,
  authorizeRoles("admin"),
  upload.single('quotation'),
  async (req, res) => {
    const { bookingId } = req.params;

    try {
      const booking = await Booking.findById(bookingId);

      if (!booking || booking.status !== "approved_by_manager") {
        return res.status(400).json({ message: "Booking is not approved by manager or does not exist." });
      }

      // Update the booking status to 'approved_by_admin'
      booking.status = "approved_by_admin";

      // Get the user's email from the booking
      const user = await User.findById(booking.userId);
      if (!user) {
        throw new Error("User not found");
      }

      let coordinatorName = "Event Coordinator";
      let coordinatorEmail;
      // Get the user's email from the booking's eventCoordinators
      if (booking.eventCoordinators && booking.eventCoordinators.length > 0) {
        coordinatorName = booking.eventCoordinators[0].name || "Event Coordinator";
        coordinatorEmail = booking.eventCoordinators[0].email;
      }

      if (!coordinatorEmail) {
        console.warn(`No coordinator email found for booking ${bookingId}. Using user's email as fallback.`);
        coordinatorEmail = user.email;  // Fallback to user's email if no coordinator email is found
      }

      if (!coordinatorEmail) {
        throw new Error("No valid email found for sending approval notification");
      }

      // Prepare email content
      const attachments = [];
      if (req.file) {
        // Only accept PDFs
        if (req.file.mimetype !== 'application/pdf') {
          return res.status(400).json({ message: 'Only PDF files are allowed for quotation attachment.' });
        }
        attachments.push({
          filename: req.file.originalname || 'quotation.pdf',
          content: req.file.buffer,
          contentType: req.file.mimetype,
        });
      }

      const emailContent = {
        to: coordinatorEmail,
        subject: "Banquet Hall Booking Approved",
        text: `Dear ${coordinatorName},

Your banquet hall booking has been approved.
Booking Details:
- Event: ${booking.eventName}
- Date: ${new Date(booking.bookingDate).toLocaleDateString()}
- Time: ${booking.startTime} - ${booking.endTime}
${booking.specialEquipmentRequests ? `\nSpecial Equipment Requests:\n${booking.specialEquipmentRequests}` : ''}
${attachments.length ? '\nA quotation PDF is attached to this email.' : ''}

Thank you.`,
        attachments,
      };

      // Send email
      try {
        await sendEmail(emailContent);
        console.log("Approval email sent successfully");
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
        // Continue with the booking process even if email fails
      }

      // Save the booking after status update
      await booking.save();

      // Send notifications (existing notification logic)
      const manager = await User.findOne({ role: "manager" });
      
      const managerNotification = new Notification({
        userId: manager._id,
        message: `Booking for seminar hall "${booking.seminarHallId}" has been approved by admin.`,
        bookingId: booking._id,
      });

      const userNotification = new Notification({
        userId: user._id,
        message: `Your booking for seminar hall "${booking.seminarHallId}" has been approved by admin.`,
        bookingId: booking._id,
      });

      await Promise.all([
        managerNotification.save(),
        userNotification.save()
      ]);

      res.status(200).json({ 
        message: "Booking approved by admin and email sent",
        booking 
      });
    } catch (error) {
      console.error("Error in admin approval route:", error);
      res.status(500).json({ 
        message: "Error approving booking by admin", 
        error: error.message 
      });
    }
  }
);

// Route to confirm the booking and finalize it
router.post("/confirm", async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking || booking.status !== "approved_by_admin") {
      return res.status(400).json({ message: "Booking is not approved by admin or does not exist." });
    }

    // Update the status to 'booked'
    booking.status = "booked";

    await booking.save();

    // Send notification to the manager
    const manager = await User.findById(booking.managerId);
    const managerNotification = new Notification({
      userId: manager._id,
      message: `Booking for seminar hall "${booking.seminarHallId.name}" has been confirmed.`,
      bookingId: booking._id,
    });
    await managerNotification.save();

    // Send notification to the user
    const user = await User.findById(booking.userId);
    const userNotification = new Notification({
      userId: user._id,
      message: `Your booking for seminar hall "${booking.seminarHallId.name}" has been confirmed.`,
      bookingId: booking._id,
    });
    await userNotification.save();

    res.status(200).json({ message: "Booking confirmed", booking });
  } catch (error) {
    console.error("Error in booking confirmation route:", error);
    res.status(500).json({ message: "Error confirming booking", error: error.message });
  }
});

// Route for manager to view all pending bookings
router.get("/pending/manager", async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: "pending" }).populate("userId seminarHallId");
    res.status(200).json({ bookings: pendingBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bookings for manager", error });
  }
});
router.get("/confirmed/manager", async (req, res) => {
  try {
    const confirmedBookings = await Booking.find({ status: "approved_by_manager" }).populate("userId seminarHallId");
    res.status(200).json({ bookings: confirmedBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bookings for manager", error });
  }
});
router.get("/rejected/manager", async (req, res) => {
  try {
    const rejectedBookings = await Booking.find({ status: "rejected_by_manager" }).populate("userId seminarHallId");
    res.status(200).json({ bookings:rejectedBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bookings for manager", error });
  }
});

// Route for admin to view all pending bookings
router.get("/pending/admin", async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: "approved_by_manager" }).populate("userId seminarHallId managerId");
    res.status(200).json({ bookings: pendingBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bookings for admin", error });
  }
});

// Route: Get all bookings for a specific user
router.get('/user', verifyToken, async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Fetch bookings for the user with related data (seminarHall, eventCoordinators)
    const bookings = await Booking.find({ userId })
      .populate('seminarHallId', 'name location seatingCapacity') // Include specific fields of seminar hall
      .populate('managerId', 'name email') // Include manager details
      .populate('adminId', 'name email') // Include admin details
      .exec();

    // Respond with the bookings
    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error. Could not fetch bookings.' });
  }
});
router.get("/all", async (req, res) => {
  try {
    const rejectedBookings = await Booking.find().populate("userId seminarHallId");
    res.status(200).json({ bookings:rejectedBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bookings for manager", error });
  }
});



// Route to view booking details
router.get("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("seminarHallId") // Populate seminar hall details (if needed)
      .populate("userId"); // Populate user details (if needed)
      console.log(booking);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking details", error: err.message });
  }
});

// Route for manager to reject booking
router.patch(
  "/:bookingId/reject/manager",
  verifyToken,
  authorizeRoles("manager"), // Only managers can reject
  async (req, res) => {
    const { bookingId } = req.params;
    const { reason } = req.body; // Get the rejection reason from the request body

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    try {
      const booking = await Booking.findById(bookingId);

      if (!booking || booking.status !== "pending") {
        return res.status(400).json({ message: "Booking not found or not in a pending state." });
      }

      booking.status = "rejected_by_manager";
      booking.rejectionReason = reason; // Save the rejection reason

      let coordinatorName = "Event Coordinator";
      // Get the user's email from the booking's eventCoordinators
      if (booking.eventCoordinators && booking.eventCoordinators.length > 0) {
        coordinatorName = booking.eventCoordinators[0].name || "Event Coordinator";
        coordinatorEmail = booking.eventCoordinators[0].email;
      }

      if (!coordinatorEmail) {
        console.warn(`No coordinator email found for booking ${bookingId}. Using user's email as fallback.`);
        coordinatorEmail = user.email;  // Fallback to user's email if no coordinator email is found
      }

      if (!coordinatorEmail) {
        throw new Error("No valid email found for sending rejection notification");
      }

      // Prepare email content
      const emailContent = {
        to: coordinatorEmail,
        subject: "Banquet Hall Booking Rejected",
        text: `Dear ${coordinatorName},
Your banquet hall booking has been rejected.
Booking Details:
- Event: ${booking.eventName}
- Date: ${new Date(booking.bookingDate).toLocaleDateString()}
- Time: ${booking.startTime} - ${booking.endTime}
Reason: ${reason}`
      };

      // Send email
      try {
        await sendEmail(emailContent);
        console.log("Rejection email sent successfully");
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
        // Continue with the booking process even if email fails
      }

      // Save the booking after status update
      await booking.save();

      // Send notification
      // const user = await User.findById(booking.userId);
      // const notification = new Notification({
      //   userId: user._id,
      //   message: `Your booking for seminar hall "${booking.seminarHallId}" has been rejected. Reason: ${reason}`,
      //   bookingId,
      // });
      // await notification.save();

      res.status(200).json({ message: "Booking rejected with reason", booking });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting booking", error });
    }
  }
);

router.get("/all", async (req, res) => {
  try {
    const rejectedBookings = await Booking.find().populate("userId seminarHallId");
    res.status(200).json({ bookings:rejectedBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bookings for manager", error });
  }
});

// Route for admin to reject booking
router.patch(
  "/:bookingId/reject/admin",
  verifyToken,
  authorizeRoles("admin"), // Only admin can access
  async (req, res) => {
    const { bookingId } = req.params;
    const { reason }=req.body;

    try {
      const booking = await Booking.findById(bookingId);

      if (!booking || booking.status !== "approved_by_manager") {
        return res.status(400).json({ message: "Booking is not approved by manager or does not exist." });
      }

      // Update the booking status to 'rejected_by_admin' and include reason
      booking.status = "rejected_by_admin";
      booking.rejectionReason = reason;

      let coordinatorName = "Event Coordinator";
      // Get the user's email from the booking's eventCoordinators
      if (booking.eventCoordinators && booking.eventCoordinators.length > 0) {
        coordinatorName = booking.eventCoordinators[0].name || "Event Coordinator";
        coordinatorEmail = booking.eventCoordinators[0].email;
      }

      if (!coordinatorEmail) {
        console.warn(`No coordinator email found for booking ${bookingId}. Using user's email as fallback.`);
        coordinatorEmail = user.email;  // Fallback to user's email if no coordinator email is found
      }

      if (!coordinatorEmail) {
        throw new Error("No valid email found for sending rejection notification");
      }

      // Prepare email content
      const emailContent = {
        to: coordinatorEmail,
        subject: "Banquet Hall Booking Rejected",
        text: `Dear ${coordinatorName},
Your banquet hall booking has been rejected.
Booking Details:
- Event: ${booking.eventName}
- Date: ${new Date(booking.bookingDate).toLocaleDateString()}
- Time: ${booking.startTime} - ${booking.endTime}
Reason: ${reason}`
      };

      // Send email
      try {
        await sendEmail(emailContent);
        console.log("Rejection email sent successfully");
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
        // Continue with the booking process even if email fails
      }

      // Save the booking after status update
      await booking.save();

      // // Notify the user and manager
      // const user = await User.findById(booking.userId);
      // const manager = await User.findById(booking.managerId);

      // const userNotification = new Notification({
      //   userId: user._id,
      //   message: `Your booking for seminar hall has been rejected by the admin.
      //   Reason: ${reason}`,
      //   bookingId: booking._id,
      // });

      // const managerNotification = new Notification({
      //   userId: manager._id,
      //   message: `Booking for seminar hall "${booking.seminarHallId}" has been rejected by the admin. Reason: ${reason}`,
      //   bookingId: booking._id,
      // });

      // await userNotification.save();
      // await managerNotification.save();

      res.status(200).json({ message: "Booking rejected by admin", booking });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting booking by admin", error });
    }
  }
);

// Route to delete a booking
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id; // Get the authenticated user's ID

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is the owner of the booking
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this booking" });
    }

    // Check if the booking is already approved by admin
    if (booking.status === "approved_by_admin") {
      return res.status(400).json({ message: "Cannot delete an approved booking" });
    }

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    // If you want to send an email notification about the deletion
    if (booking.eventCoordinators && booking.eventCoordinators.length > 0) {
      const coordinatorName = booking.eventCoordinators[0].name || "Event Coordinator";
      const coordinatorEmail = booking.eventCoordinators[0].email;

      if (coordinatorEmail) {
        const emailContent = {
          to: coordinatorEmail,
          subject: "Banquet Hall Booking Cancelled",
          text: `Dear ${coordinatorName},

Your banquet hall booking has been cancelled.
Booking Details:
- Event: ${booking.eventName}
- Date: ${new Date(booking.bookingDate).toLocaleDateString()}
- Time: ${booking.startTime} - ${booking.endTime}
${booking.specialEquipmentRequests ? `\nSpecial Equipment Requests:\n${booking.specialEquipmentRequests}` : ''}

Thank you.`
        };

        try {
          await sendEmail(emailContent);
        } catch (emailError) {
          console.error("Failed to send cancellation email:", emailError);
          // Continue with deletion even if email fails
        }
      }
    }

    res.status(200).json({ message: "Booking deleted successfully" });

  } catch (error) {
    console.error("Error in delete booking route:", error);
    res.status(500).json({ 
      message: "Error deleting booking", 
      error: error.message 
    });
  }
});

// Route to update a booking
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const {
      bookingDate,
      startTime,
      endTime,
      eventName,
      eventDetails,
      eventCoordinators,
      pax,
      foodRequired,
      costPerPlate,
      additionalDetails,
    } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is the owner of the booking
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    // Check if the booking is already approved by admin
    if (booking.status === "approved_by_admin") {
      return res.status(400).json({ message: "Cannot update an approved booking" });
    }

    // Check for conflicting bookings if date or time is changed
    if (bookingDate !== booking.bookingDate || startTime !== booking.startTime || endTime !== booking.endTime) {
      const existingBooking = await Booking.findOne({
        _id: { $ne: bookingId }, // Exclude current booking
        seminarHallId: booking.seminarHallId,
        bookingDate,
        $or: [
          { startTime: { $lte: endTime }, endTime: { $gte: startTime } },
        ],
      });

      if (existingBooking) {
        return res.status(400).json({ message: "Seminar hall is already booked for this time" });
      }
    }
    if(startTime>=endTime){
      return res.status(400).json({message:"Invalid Time Slot"})
    }

    // Banquet validations (if provided)
    if (pax !== undefined && (Number(pax) <= 0)) {
      return res.status(400).json({ message: "Invalid number of pax" });
    }
    if (foodRequired === true && (costPerPlate === undefined || Number(costPerPlate) < 0)) {
      return res.status(400).json({ message: "Invalid cost per plate" });
    }

    // Update the booking
    booking.bookingDate = bookingDate;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.eventName = eventName;
    booking.eventDetails = eventDetails;
    booking.eventCoordinators = eventCoordinators;
    if (pax !== undefined) booking.pax = Number(pax);
    if (foodRequired !== undefined) booking.foodRequired = Boolean(foodRequired);
    if (foodRequired) {
      booking.costPerPlate = Number(costPerPlate);
    } else if (foodRequired === false) {
      booking.costPerPlate = undefined;
    }
    if (additionalDetails !== undefined) booking.additionalDetails = additionalDetails;
    // Reset status to pending if it was approved by manager
    if (booking.status === "approved_by_manager") {
      booking.status = "pending";
    }

    await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking
    });

  } catch (error) {
    console.error("Error in update booking route:", error);
    res.status(500).json({ 
      message: "Error updating booking", 
      error: error.message 
    });
  }
});


module.exports = router;

