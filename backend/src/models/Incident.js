const pool = require('../config/database');

class IncidentModel {
  /**
   * Create a new incident
   */
  static async create(incidentData) {
    const { title, service, severity, status = 'OPEN', owner, summary } = incidentData;
    
    const query = `
      INSERT INTO incidents (title, service, severity, status, owner, summary)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [title, service, severity, status, owner, summary];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get incidents with pagination, filtering, and sorting
   */
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      severity,
      status,
      service,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (search) {
      conditions.push(`(title ILIKE $${paramIndex} OR summary ILIKE $${paramIndex} OR owner ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (severity) {
      conditions.push(`severity = $${paramIndex}`);
      values.push(severity);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (service) {
      conditions.push(`service = $${paramIndex}`);
      values.push(service);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sortBy to prevent SQL injection
    const validSortColumns = ['created_at', 'updated_at', 'title', 'severity', 'status', 'service'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM incidents ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const dataQuery = `
      SELECT * FROM incidents
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      data: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Find incident by ID
   */
  static async findById(id) {
    const query = 'SELECT * FROM incidents WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Update incident by ID
   */
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Build SET clause dynamically
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE incidents
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete incident by ID
   */
  static async delete(id) {
    const query = 'DELETE FROM incidents WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get unique services
   */
  static async getServices() {
    const query = 'SELECT DISTINCT service FROM incidents ORDER BY service';
    const result = await pool.query(query);
    return result.rows.map(row => row.service);
  }
}

module.exports = IncidentModel;