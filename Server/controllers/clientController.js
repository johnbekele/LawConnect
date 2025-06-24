const clientModel = require('../models/client');
const userModel = require('../models/user');

class ClientController {
  static async getClients(req, res) {
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
  }

  static async getClientByCaseRef(req, res) {
    try {
      const { case_ref_no } = req.params;
      const client = await clientModel.findOne({ case_ref_no });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async createClient(req, res) {
    try {
      const { client_name, phone, case_ref_no } = req.body;
      const user = await userModel.findOne({ email: req.user.email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingClient = await clientModel.findOne({ case_ref_no, user: user._id });
      if (existingClient) {
        return res.status(400).json({ message: "Case reference number already exists for this user" });
      }

      const newClient = new clientModel({ 
        client_name, 
        phone, 
        case_ref_no, 
        user: user._id 
      });
      await newClient.save();

      user.client.push(newClient._id);
      await user.save();

      res.status(201).json({ 
        success: true, 
        message: "Client created successfully", 
        client: newClient 
      });
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Debug route
  static async getAllClients(req, res) {
    try {
      const clients = await clientModel.find();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching clients" });
    }
  }
}

module.exports = ClientController;