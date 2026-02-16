import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import incidentService from '../services/api';
import './IncidentForm.css';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    service: '',
    severity: '',
    status: '',
    owner: '',
    summary: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch incident details
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await incidentService.getIncidentById(id);
        setIncident(response.data);
        setFormData({
          title: response.data.title,
          service: response.data.service,
          severity: response.data.severity,
          status: response.data.status,
          owner: response.data.owner || '',
          summary: response.data.summary || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch incident details');
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.service.trim()) {
      newErrors.service = 'Service is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const response = await incidentService.updateIncident(id, formData);
      setIncident(response.data);
      setEditing(false);
      setUpdateSuccess(true);
      
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update incident');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (incident) {
      setFormData({
        title: incident.title,
        service: incident.service,
        severity: incident.severity,
        status: incident.status,
        owner: incident.owner || '',
        summary: incident.summary || '',
      });
    }
    setEditing(false);
    setErrors({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !incident) {
    return (
      <div className="form-container">
        <div className="error-message">{error}</div>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <div>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Back to List
          </button>
          <h1>Incident Details</h1>
        </div>
        {!editing && (
          <button
            className="btn-primary"
            onClick={() => setEditing(true)}
          >
            Edit Incident
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {updateSuccess && <div className="success-message">Incident updated successfully!</div>}

      <div className="card">
        <div className="incident-meta">
          <div className="meta-item">
            <span className="meta-label">Incident ID:</span>
            <span className="meta-value">{incident.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{formatDate(incident.created_at)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Last Updated:</span>
            <span className="meta-value">{formatDate(incident.updated_at)}</span>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            {editing ? (
              <>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </>
            ) : (
              <div className="read-only-field">{incident.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="service">
              Service <span className="required">*</span>
            </label>
            {editing ? (
              <>
                <input
                  type="text"
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={errors.service ? 'error' : ''}
                />
                {errors.service && <span className="field-error">{errors.service}</span>}
              </>
            ) : (
              <div className="read-only-field">{incident.service}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="severity">Severity</label>
            {editing ? (
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
              >
                <option value="SEV1">SEV1 - Critical</option>
                <option value="SEV2">SEV2 - High</option>
                <option value="SEV3">SEV3 - Medium</option>
                <option value="SEV4">SEV4 - Low</option>
              </select>
            ) : (
              <div className="read-only-field">
                <span className={`badge badge-${incident.severity.toLowerCase()}`}>
                  {incident.severity}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            {editing ? (
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="OPEN">Open</option>
                <option value="MITIGATED">Mitigated</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            ) : (
              <div className="read-only-field">
                <span className={`badge badge-${incident.status.toLowerCase()}`}>
                  {incident.status}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="owner">Assigned To</label>
            {editing ? (
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Optional"
              />
            ) : (
              <div className="read-only-field">{incident.owner || '-'}</div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="summary">Summary</label>
            {editing ? (
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Detailed description of the incident..."
                rows="8"
              />
            ) : (
              <div className="read-only-field summary-field">
                {incident.summary || 'No summary provided'}
              </div>
            )}
          </div>
        </div>

        {editing && (
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentDetail;