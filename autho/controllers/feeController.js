const FeesModel = require('../models/fees');
const userModel = require('../models/user');

class FeeController {
  static async getFees(req, res) {
    try {
      const user = await userModel.findOne({ email: req.user.email }).populate("fees");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user.fees);
    } catch (error) {
      console.error("Error fetching fees:", error);
      res.status(500).json({ success: false, message: "Failed to retrieve fees" });
    }
  }

  static async createFee(req, res) {
    try {
      const user = await userModel.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { case_ref_no, clientName, fees, amount_paid, pending_fees, payment_mode, due_date, remarks } = req.body;

      if (!case_ref_no || !clientName || !fees || !amount_paid || !pending_fees || !payment_mode || !due_date) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      const newFee = new FeesModel({
        user: user._id,
        case_ref_no,
        clientName,
        fees,
        amount_paid,
        pending_fees,
        payment_mode,
        due_date: new Date(due_date),
        remarks,
      });

      await newFee.save();
      user.fees.push(newFee._id);
      await user.save();

      res.status(201).json({ 
        success: true, 
        message: "Fee record created successfully!", 
        fee: newFee 
      });
    } catch (error) {
      console.error("Error creating fee record:", error);
      res.status(500).json({ success: false, message: "Failed to create fee record" });
    }
  }

  static async updateFee(req, res) {
    try {
      const updatedFee = await FeesModel.findByIdAndUpdate(
        req.params.id, 
        req.body, 
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
  }

  static async deleteFee(req, res) {
    try {
      const deletedFee = await FeesModel.findByIdAndDelete(req.params.id);
      if (!deletedFee) {
        return res.status(404).json({ message: "Fee record not found" });
      }
      
      res.json({ message: "Fee record deleted successfully!" });
    } catch (error) {
      console.error("Error deleting fee record:", error);
      res.status(500).json({ message: "Failed to delete fee record" });
    }
  }
}

module.exports = FeeController;