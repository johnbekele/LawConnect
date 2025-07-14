import FeesModel from '../models/fees.js';    // Note the .js extension for local imports
import userModel from '../models/user.js';    // Note the .js extension for local imports

export const getFees = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "Unauthorized: No user found in request" });
    }

    const user = await userModel.findOne({ email: req.user.email }).populate("fees");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve fees" });
  }
};

export const createFee = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized: User information missing" });
    }

    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { case_ref_no, clientName, fees, amount_paid, pending_fees, payment_mode, due_date, remarks } = req.body;

    // Basic validation for required fields
    if (!case_ref_no || !clientName || fees === undefined || amount_paid === undefined || pending_fees === undefined || !payment_mode || !due_date) {
      return res.status(400).json({ success: false, message: "All required fields (case_ref_no, clientName, fees, amount_paid, pending_fees, payment_mode, due_date) are required." });
    }

    const newFee = new FeesModel({
      user: user._id,
      case_ref_no,
      clientName,
      fees,
      amount_paid,
      pending_fees,
      payment_mode,
      due_date: new Date(due_date), // Convert due_date string to a Date object
      remarks,
    });

    await newFee.save(); // Save the new fee record to the database
    user.fees.push(newFee._id); // Add the new fee's ID to the user's fees array
    await user.save(); // Save the updated user document

    res.status(201).json({
      success: true,
      message: "Fee record created successfully!",
      fee: newFee
    });
  } catch (error) {
    console.error("Error creating fee record:", error);
    res.status(500).json({ success: false, message: "Failed to create fee record" });
  }
};

export const updateFee = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from request parameters

    // Find and update the fee record by ID
    // { new: true } returns the updated document
    const updatedFee = await FeesModel.findByIdAndUpdate(
      id,
      req.body, // Use the request body to update fields
      { new: true }
    );

    if (!updatedFee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    res.json({
      message: "Fee record updated successfully!",
      updatedFee
    });
  } catch (error) {
    console.error("Error updating fee record:", error);
    res.status(500).json({ message: "Failed to update fee record" });
  }
};

export const deleteFee = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from request parameters

    // Find and delete the fee record by ID
    const deletedFee = await FeesModel.findByIdAndDelete(id);
    if (!deletedFee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    // Optionally, remove the fee reference from the user's fees array as well
    // This would require finding the user and filtering their fees array.
    // For simplicity, this step is omitted as it adds complexity not directly requested.

    res.json({ message: "Fee record deleted successfully!" });
  } catch (error) {
    console.error("Error deleting fee record:", error);
    res.status(500).json({ message: "Failed to delete fee record" });
  }
};
