const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const services = [
  'Auth Service',
  'Payment Gateway',
  'User API',
  'Notification Service',
  'Search Engine',
  'Analytics Pipeline',
  'Database Cluster',
  'CDN',
  'Load Balancer',
  'Cache Layer',
  'Message Queue',
  'File Storage',
  'Email Service',
  'SMS Gateway',
  'Recommendation Engine',
  'Video Streaming',
  'API Gateway',
  'Monitoring Service',
  'Logging Service',
  'Backup Service'
];

const severities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];

const owners = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Davis',
  'David Wilson',
  'Emma Brown',
  'Frank Miller',
  'Grace Lee',
  'Henry Taylor',
  'Iris Chen',
  'Jack Anderson',
  null, // Some incidents may not have an owner
  null
];

const incidentTitles = [
  'Service Downtime',
  'High Latency Detected',
  'Database Connection Pool Exhausted',
  'Memory Leak',
  'API Rate Limit Exceeded',
  'Authentication Failure',
  'Payment Processing Error',
  'Cache Invalidation Issue',
  'Network Timeout',
  'Disk Space Critical',
  'CPU Spike',
  'SSL Certificate Expiring',
  'Data Sync Failure',
  'Email Delivery Failure',
  'Third-party Integration Down',
  'Load Balancer Misconfiguration',
  'DDoS Attack Detected',
  'Unauthorized Access Attempt',
  'Data Corruption',
  'Backup Failed',
  'Queue Processing Delay',
  'DNS Resolution Error',
  'CDN Performance Degradation',
  'API Endpoint Not Responding',
  'Database Replication Lag'
];

const summaryTemplates = [
  'Users reported inability to access the service. Investigation revealed {issue}. Team is working on resolution.',
  'Monitoring alerts triggered for abnormal behavior. Root cause identified as {issue}. Mitigation in progress.',
  'Performance degradation observed across multiple regions. Analysis shows {issue} is the primary cause.',
  'Automated health checks failed. Manual inspection confirmed {issue}. Emergency patch being deployed.',
  'Customer support tickets increased significantly. After investigation, {issue} was identified as the culprit.',
  'System metrics exceeded threshold values. Deep dive revealed {issue}. Immediate action taken.',
  'Production deployment caused unexpected behavior. Rollback initiated due to {issue}.',
  'Third-party service outage impacting our systems. Workaround implemented while monitoring {issue}.',
  'Security scan detected potential vulnerability. Investigation confirmed {issue}. Patch scheduled.',
  'Data inconsistency reported by users. Audit trail shows {issue} occurred during maintenance window.'
];

const issues = [
  'misconfigured firewall rules',
  'insufficient capacity planning',
  'memory leak in recent deployment',
  'network congestion',
  'database index corruption',
  'expired credentials',
  'race condition in concurrent requests',
  'upstream dependency failure',
  'configuration drift',
  'hardware failure',
  'software bug in v2.3.1',
  'resource exhaustion',
  'cache stampede',
  'deadlock in transaction processing',
  'DNS propagation delay'
];

function generateRandomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSummary() {
  const template = getRandomElement(summaryTemplates);
  const issue = getRandomElement(issues);
  return template.replace('{issue}', issue);
}

async function seedIncidents() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await pool.query('TRUNCATE TABLE incidents RESTART IDENTITY CASCADE');
    console.log('✅ Cleared existing incidents');

    const incidents = [];
    
    // Generate 200 incidents
    for (let i = 0; i < 200; i++) {
      const service = getRandomElement(services);
      const severity = getRandomElement(severities);
      const status = getRandomElement(statuses);
      const owner = getRandomElement(owners);
      const title = `${getRandomElement(incidentTitles)} - ${service}`;
      const summary = Math.random() > 0.2 ? generateSummary() : null; // 80% have summaries
      const createdAt = generateRandomDate(90); // Within last 90 days
      
      incidents.push({
        id: uuidv4(),
        title,
        service,
        severity,
        status,
        owner,
        summary,
        created_at: createdAt,
        updated_at: createdAt
      });
    }

    // Batch insert
    const query = `
      INSERT INTO incidents (id, title, service, severity, status, owner, summary, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    for (const incident of incidents) {
      await pool.query(query, [
        incident.id,
        incident.title,
        incident.service,
        incident.severity,
        incident.status,
        incident.owner,
        incident.summary,
        incident.created_at,
        incident.updated_at
      ]);
    }

    console.log(`✅ Successfully seeded ${incidents.length} incidents`);
    
    // Display statistics
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN severity = 'SEV1' THEN 1 END) as sev1,
        COUNT(CASE WHEN severity = 'SEV2' THEN 1 END) as sev2,
        COUNT(CASE WHEN severity = 'SEV3' THEN 1 END) as sev3,
        COUNT(CASE WHEN severity = 'SEV4' THEN 1 END) as sev4,
        COUNT(CASE WHEN status = 'OPEN' THEN 1 END) as open,
        COUNT(CASE WHEN status = 'MITIGATED' THEN 1 END) as mitigated,
        COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved
      FROM incidents
    `);

    console.log('\n📊 Seeding Statistics:');
    console.log('─────────────────────');
    console.log(`Total Incidents: ${stats.rows[0].total}`);
    console.log(`\nBy Severity:`);
    console.log(`  SEV1: ${stats.rows[0].sev1}`);
    console.log(`  SEV2: ${stats.rows[0].sev2}`);
    console.log(`  SEV3: ${stats.rows[0].sev3}`);
    console.log(`  SEV4: ${stats.rows[0].sev4}`);
    console.log(`\nBy Status:`);
    console.log(`  OPEN: ${stats.rows[0].open}`);
    console.log(`  MITIGATED: ${stats.rows[0].mitigated}`);
    console.log(`  RESOLVED: ${stats.rows[0].resolved}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedIncidents();
}

module.exports = seedIncidents;