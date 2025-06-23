const casesModel = require('../models/cases');
const userModel = require('../models/user');

class CaseController {
  static async getCases(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: No user found in request" });
      }

      const user = await userModel.findOne({ email: req.user.email }).populate("cases");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user.cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createCase(req, res) {
    try {
      const user = await userModel.findOne({ email: req.user.email });
      const { case_ref_no, caseTitle, clientName, status, nextHearing, fees, pending_fees } = req.body;

      const newCase = await casesModel.create({
        user: user._id,
        case_ref_no,
        caseTitle,
        clientName,
        status,
        nextHearing,
        fees,
        pending_fees,
      });

      user.cases.push(newCase._id);
      await user.save();

      res.status(201).json({ 
        success: true, 
        message: "Case created successfully", 
        case: newCase 
      });
    } catch (error) {
      console.error("Error creating case:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateCase(req, res) {
    try {
      const { case_ref_no } = req.params;
      const { caseTitle, clientName, status, nextHearing, fees, pending_fees } = req.body;

      const updatedCase = await casesModel.findOneAndUpdate(
        { case_ref_no },
        {
          caseTitle,
          clientName,
          status,
          nextHearing: nextHearing ? new Date(nextHearing) : null,
          fees,
          pending_fees,
        },
        { new: true }
      );

      if (!updatedCase) {
        return res.status(404).json({ success: false, message: "Case not found" });
      }

      res.status(200).json({ 
        success: true, 
        message: "Case updated successfully", 
        case: updatedCase 
      });
    } catch (error) {
      console.error("Error updating case:", error);
      res.status(500).json({ success: false, message: "An error occurred while updating the case" });
    }
  }

  static async deleteCase(req, res) {
    try {
      const { case_ref_no } = req.params;

      if (isNaN(case_ref_no)) {
        return res.status(400).json({ success: false, message: "Invalid case reference number" });
      }

      const result = await casesModel.deleteOne({ case_ref_no: Number(case_ref_no) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Case not found" });
      }

      res.status(200).json({ success: true, message: "Case deleted successfully" });
    } catch (error) {
      console.error("Error deleting case:", error);
      res.status(500).json({ success: false, message: "Failed to delete case" });
    }
  }

  static async getHearings(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      const cases = await casesModel.find({ user: req.user.id }, "nextHearing");
      res.json(cases.map((c) => c.nextHearing));
    } catch (error) {
      console.error("Error fetching hearing dates:", error);
      res.status(500).json({ error: "Failed to fetch hearing dates" });
    }
  }

  static async getPendingCases(req, res) {
    try {
      const pendingCases = await casesModel.find(
        { user: req.user.id, status: "Pending" },
        "caseTitle clientName nextHearing"
      );

      res.json(pendingCases);
    } catch (error) {
      console.error("Error fetching pending cases:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Debug route
  static async getAllCases(req, res) {
    try {
      const cases = await casesModel.find();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cases" });
    }
  }
}

module.exports = CaseController;