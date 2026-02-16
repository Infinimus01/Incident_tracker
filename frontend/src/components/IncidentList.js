import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import incidentService from '../services/api';
import './IncidentList.css';

const IncidentList = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    severity: '',
    status: '',
    service: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  // Debounce state for search
  const [searchInput, setSearchInput] = useState('');

  // Services for dropdown
  const [services, setServices] = useState([]);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await incidentService.getServices();
        setServices(response.data || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };
    fetchServices();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Fetch incidents
  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await incidentService.getIncidents(params);
      
      setIncidents(response.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  // Handle sort
  const handleSort = (column) => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'DESC' ? 'ASC' : 'DESC';
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: newOrder,
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      severity: '',
      status: '',
      service: '',
      sortBy: 'created_at',
      sortOrder: 'DESC',
    });
    setSearchInput('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get sort indicator
  const getSortIndicator = (column) => {
    if (filters.sortBy !== column) return ' ⇅';
    return filters.sortOrder === 'DESC' ? ' ↓' : ' ↑';
  };

  return (
    <div className="incident-list-container">
      <div className="header">
        <h1>Incident Tracker</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/create')}
        >
          + New Incident
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-section card">
        <div className="filters-row">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search title, summary, owner..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Service</label>
            <select 
              value={filters.service} 
              onChange={(e) => handleFilterChange('service', e.target.value)}
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Severity</label>
            <select 
              value={filters.severity} 
              onChange={(e) => handleFilterChange('severity', e.target.value)}
            >
              <option value="">All</option>
              <option value="SEV1">SEV1</option>
              <option value="SEV2">SEV2</option>
              <option value="SEV3">SEV3</option>
              <option value="SEV4">SEV4</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="filter-group">
            <button 
              className="btn-secondary clear-btn"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="results-info">
        Showing {incidents.length} of {pagination.total} incidents
      </div>

      {/* Table */}
      <div className="table-container card">
        {loading ? (
          <div className="spinner"></div>
        ) : incidents.length === 0 ? (
          <div className="no-data">No incidents found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('title')}
                >
                  Title {getSortIndicator('title')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('service')}
                >
                  Service {getSortIndicator('service')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('severity')}
                >
                  Severity {getSortIndicator('severity')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIndicator('status')}
                </th>
                <th>Owner</th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('created_at')}
                >
                  Created {getSortIndicator('created_at')}
                </th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr 
                  key={incident.id}
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="title-cell">{incident.title}</td>
                  <td>{incident.service}</td>
                  <td>
                    <span className={`badge badge-${incident.severity.toLowerCase()}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${incident.status.toLowerCase()}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td>{incident.owner || '-'}</td>
                  <td className="date-cell">{formatDate(incident.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn-secondary"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and adjacent pages
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.page) <= 1
                );
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const prev = array[index - 1];
                const showEllipsis = prev && page - prev > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="ellipsis">...</span>}
                    <button
                      className={`page-btn ${page === pagination.page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            className="btn-secondary"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default IncidentList;