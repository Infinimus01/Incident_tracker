const IncidentModel = require('../models/Incident');

class IncidentController {
  /**
   * Create a new incident
   */
  static async createIncident(req, res) {
    try {
      const incident = await IncidentModel.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Incident created successfully',
        data: incident
      });
    } catch (error) {
      console.error('Error creating incident:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create incident',
        error: error.message
      });
    }
  }

  /**
   * Get all incidents with pagination, filtering, and sorting
   */
  static async getIncidents(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        severity,
        status,
        service,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const result = await IncidentModel.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        severity,
        status,
        service,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching incidents:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch incidents',
        error: error.message
      });
    }
  }

  /**
   * Get incident by ID
   */
  static async getIncidentById(req, res) {
    try {
      const { id } = req.params;
      const incident = await IncidentModel.findById(id);

      if (!incident) {
        return res.status(404).json({
          success: false,
          message: 'Incident not found'
        });
      }

      res.json({
        success: true,
        data: incident
      });
    } catch (error) {
      console.error('Error fetching incident:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch incident',
        error: error.message
      });
    }
  }

  /**
   * Update incident by ID
   */
  static async updateIncident(req, res) {
    try {
      const { id } = req.params;
      
      // Check if incident exists
      const existingIncident = await IncidentModel.findById(id);
      if (!existingIncident) {
        return res.status(404).json({
          success: false,
          message: 'Incident not found'
        });
      }

      const updatedIncident = await IncidentModel.update(id, req.body);

      res.json({
        success: true,
        message: 'Incident updated successfully',
        data: updatedIncident
      });
    } catch (error) {
      console.error('Error updating incident:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update incident',
        error: error.message
      });
    }
  }

  /**
   * Delete incident by ID
   */
  static async deleteIncident(req, res) {
    try {
      const { id } = req.params;
      
      const deletedIncident = await IncidentModel.delete(id);

      if (!deletedIncident) {
        return res.status(404).json({
          success: false,
          message: 'Incident not found'
        });
      }

      res.json({
        success: true,
        message: 'Incident deleted successfully',
        data: deletedIncident
      });
    } catch (error) {
      console.error('Error deleting incident:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete incident',
        error: error.message
      });
    }
  }

  /**
   * Get unique services
   */
  static async getServices(req, res) {
    try {
      const services = await IncidentModel.getServices();
      
      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services',
        error: error.message
      });
    }
  }
}

module.exports = IncidentController;