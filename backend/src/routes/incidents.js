const express = require('express');
const router = express.Router();
const IncidentController = require('../controllers/incidentController');
const {
  createIncidentValidation,
  updateIncidentValidation,
  getIncidentByIdValidation,
  getIncidentsValidation
} = require('../middleware/validation');

// Routes
router.post('/incidents', createIncidentValidation, IncidentController.createIncident);
router.get('/incidents', getIncidentsValidation, IncidentController.getIncidents);
router.get('/incidents/:id', getIncidentByIdValidation, IncidentController.getIncidentById);
router.patch('/incidents/:id', updateIncidentValidation, IncidentController.updateIncident);
router.delete('/incidents/:id', getIncidentByIdValidation, IncidentController.deleteIncident);
router.get('/services', IncidentController.getServices);

module.exports = router;