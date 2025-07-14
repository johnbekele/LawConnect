import userModel from '../models/user.js'; // Note the .js extension for local imports

export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "Unauthorized: No user found in request" });
    }

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
};

export const updateProfile = async (req, res) => {
  const { name, age, contact } = req.body;
  const profilePic = req.file ? `/uploads/profilePic/${req.file.filename}` : undefined;

  try {
    const updateData = {
      name,
      age,
      contact,
    };

    if (profilePic) updateData.profilePic = profilePic;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    console.log("✅ Profile updated successfully:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
};





export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required for deletion." });
    }

    const deletedUser = await userModel.deleteOne({ email });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Debug route - use with caution in production
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};
