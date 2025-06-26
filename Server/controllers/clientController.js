import clientModel from '../models/client.js'; // Note the .js extension for local imports
import userModel from '../models/user.js';   // Note the .js extension for local imports

export const getClients = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found in request" });
    }

    const user = await userModel.findOne({ email: req.user.email }).populate("client");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.client);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClientByCaseRef = async (req, res) => {
  try {
    const { case_ref_no } = req.params;
    // Ensure case_ref_no is valid if necessary (e.g., is a number)
    if (!case_ref_no) {
      return res.status(400).json({ message: "Case reference number is required" });
    }

    const client = await clientModel.findOne({ case_ref_no });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createClient = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized: User information missing" });
    }

    const { client_name, phone, case_ref_no } = req.body;
    // Basic validation for required fields
    if (!client_name || !phone || !case_ref_no) {
      return res.status(400).json({ success: false, message: "Missing required client fields" });
    }

    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a client with this case_ref_no already exists for this user
    const existingClient = await clientModel.findOne({ case_ref_no, user: user._id });
    if (existingClient) {
      return res.status(400).json({ message: "Case reference number already exists for this user" });
    }

    const newClient = new clientModel({
      client_name,
      phone,
      case_ref_no,
      user: user._id // Associate the client with the user's ID
    });
    await newClient.save();

    user.client.push(newClient._id); // Add the new client's ID to the user's client array
    await user.save(); // Save the updated user document

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client: newClient
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Debug route - use with caution in production
export const getAllClients = async (req, res) => {
  try {
    const clients = await clientModel.find();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching all clients:", error);
    res.status(500).json({ message: "Error fetching clients" });
  }
};
