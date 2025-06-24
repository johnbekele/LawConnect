const userModel = require('../models/user');

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await userModel.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        contact: user.contact || "",
        casesHandled: user.casesHandled || 0,
        casesWon: user.casesWon || 0,
        profilePic: user.profilePic || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, age, contact, profilePic } = req.body;

      const updatedUser = await userModel.findOneAndUpdate(
        { email: req.user.email },
        { $set: { name, age, contact, profilePic } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        message: "Profile updated successfully", 
        user: updatedUser 
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { email } = req.params;
      
      const deletedUser = await userModel.deleteOne({ email });
      if (deletedUser.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  }

  // Debug routes
  static async getAllUsers(req, res) {
    try {
      const users = await userModel.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }
}

module.exports = UserController;