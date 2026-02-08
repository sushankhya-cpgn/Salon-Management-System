# Logging System Documentation

## Overview

This Salon Management System uses **Winston** as the primary logging framework, combined with **Morgan** for HTTP request logging. All logs are stored in the `/logs` directory with proper categorization.

---

## Log Files Generated

### 1. **error.log**
- Contains only ERROR level logs
- Shows application errors and critical issues
- Format: JSON with stack traces

### 2. **info.log**
- Contains INFO level logs
- General application information
- User actions, appointments, authentication events

### 3. **combined.log**
- Contains all log levels
- Complete application history
- Format: JSON with timestamps

### 4. **http.log**
- HTTP request/response logs
- Only logs errors and unsuccessful responses (status >= 400)
- Request details, response times, IP addresses

### 5. **database.log**
- Database operation logs
- CRUD operations on appointments, users, services
- Query execution times

### 6. **jobs.log**
- Background job logs
- CSV import progress
- Email sending status
- Job queue processing

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install winston morgan
```

Or add to your package.json:
```json
{
  "dependencies": {
    "winston": "^3.11.0",
    "morgan": "^1.10.0"
  }
}
```

### 2. The logger is already configured in:
- `src/utils/logger.ts` - Main logger configuration
- `src/middleware/morganMiddleware.ts` - HTTP request logging
- `src/middleware/loggingMiddleware.ts` - Custom request/error logging
- `src/app.ts` - Middleware integration

---

## Usage Examples

### Basic Usage in Controllers

```typescript
import logger from '../utils/logger.js';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    logger.info(`Creating appointment for ${req.body.customerName}`);
    
    const appointment = await prisma.appointment.create({
      data: appointmentData
    });
    
    logger.info(`Appointment created successfully with ID: ${appointment.id}`);
    res.status(201).json({ message: "Success", appointment });
    
  } catch (error: any) {
    logger.error(`Failed to create appointment: ${error.message}`);
    res.status(500).json({ message: "Error", error });
  }
};
```

### In Workers (Background Jobs)

```typescript
import logger from '../utils/logger.js';

export const appointmentWorker = new Worker("appointmentQueue",
  async (job: Job) => {
    try {
      logger.info(`Starting CSV import job: ${job.id}`);
      
      // Process appointments
      await processBatch(batch);
      
      logger.info(`Batch of ${batch.length} appointments processed successfully`);
      
    } catch (error: any) {
      logger.error(`Job ${job.id} failed: ${error.message}`);
    }
  }
);

// Log job events
appointmentWorker.on('completed', (job: Job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

appointmentWorker.on('failed', (job: Job, err: any) => {
  logger.error(`Job ${job.id} failed with error: ${err.message}`);
});
```

### In Database Operations

```typescript
import logger from '../utils/logger.js';

export const updateAppointment = async (appointmentId: number, data: any) => {
  try {
    logger.info(`Updating appointment ${appointmentId} with data: ${JSON.stringify(data)}`);
    
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data
    });
    
    logger.info(`Appointment ${appointmentId} updated successfully`);
    return updated;
    
  } catch (error: any) {
    logger.error(`Database update error for appointment ${appointmentId}: ${error.message}`);
    throw error;
  }
};
```

### In Authentication

```typescript
import logger from '../utils/logger.js';

export const login = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.body.email }
    });
    
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${req.body.email}`);
      return res.status(400).json({ message: "User not found" });
    }
    
    logger.info(`User ${user.email} logged in successfully`);
    res.status(200).json({ message: "Login successful" });
    
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
  }
};
```

---

## Log Levels

| Level | Priority | Use Case |
|-------|----------|----------|
| **error** | 0 (Highest) | Critical errors, exceptions |
| **warn** | 1 | Warnings, unusual situations |
| **info** | 2 | General information, successful operations |
| **http** | 3 | HTTP requests/responses |
| **debug** | 4 (Lowest) | Debugging information |

### Using Different Levels

```typescript
logger.error('Critical error occurred');      // Errors only
logger.warn('This might be a problem');       // Warnings
logger.info('Application started');           // Information
logger.http('GET /api/appointments');         // HTTP details
logger.debug('Variable value: ' + value);     // Debug info
```

---

## Log File Locations

All logs are stored in: `{project-root}/logs/`

```
logs/
├── error.log        (Errors only)
├── info.log         (Info level and above)
├── combined.log     (All levels)
├── http.log         (HTTP requests/responses)
├── database.log     (Database operations)
└── jobs.log         (Background jobs)
```

---

## Log Format Examples

### Error Log Entry (error.log)
```json
{
  "level": "error",
  "timestamp": "2026-02-08 14:30:45:123",
  "message": "Failed to create appointment: SLOT_ALREADY_BOOKED",
  "stack": "Error: SLOT_ALREADY_BOOKED\n    at Object.createAppointment ..."
}
```

### Info Log Entry (info.log)
```json
{
  "level": "info",
  "timestamp": "2026-02-08 14:30:42:456",
  "message": "Appointment created successfully with ID: 42"
}
```

### HTTP Log Entry (http.log)
```json
{
  "level": "http",
  "timestamp": "2026-02-08 14:30:40:789",
  "message": "127.0.0.1 - - [08/Feb/2026:14:30:40 +0000] \"POST /api/appointment HTTP/1.1\" 409 45 \"-\" \"PostmanRuntime/7.32.2\" - Response Time: 125ms"
}
```

---

## Using Logger Across the Application

### Replace all `console.log` statements:

**Before:**
```typescript
console.log("Appointment created");
console.error("Error occurred", error);
```

**After:**
```typescript
logger.info("Appointment created");
logger.error(`Error occurred: ${error.message}`);
```

---

## Monitoring & Analyzing Logs

### Real-time Log Monitoring

**On Linux/Mac:**
```bash
# Watch error logs in real-time
tail -f logs/error.log

# Watch all logs
tail -f logs/combined.log

# Search for specific entries
grep "appointmentId: 42" logs/combined.log
```

**On Windows PowerShell:**
```powershell
# Watch error logs
Get-Content logs/error.log -Wait

# Search for specific entries
Select-String "Error" logs/combined.log
```

### Daily Log Rotation (Optional)

Install package for log rotation:
```bash
npm install winston-daily-rotate-file
```

Update `src/utils/logger.ts` to use rotation for large production environments.

---

## Best Practices

1. **Always log important operations:**
   - User authentication events
   - Appointment creation/updates/deletions
   - Background job processing
   - Errors and exceptions

2. **Use appropriate log levels:**
   - `error`: For exceptions and critical failures
   - `warn`: For unusual but recoverable situations
   - `info`: For successful operations
   - `debug`: For development troubleshooting

3. **Include relevant context:**
   ```typescript
   // Good
   logger.info(`User ${userId} created appointment ${appointmentId}`);
   
   // Not so good
   logger.info("Appointment created");
   ```

4. **Log before critical operations:**
   ```typescript
   logger.info(`Attempting to update appointment ${id}`);
   const result = await prisma.appointment.update(...);
   logger.info(`Successfully updated appointment ${id}`);
   ```

5. **Never log sensitive data:**
   ```typescript
   // Don't do this!
   logger.info(`User password: ${password}`);
   
   // Do this instead
   logger.info(`User ${email} attempted login`);
   ```

---

## Viewing Logs During Development

With the logger configured, you'll see:
1. **Console output**: Color-coded logs in your terminal
2. **File storage**: Persistent logs in the `/logs` directory
3. **Structured data**: JSON format for easy parsing

---

## Troubleshooting

### No logs are being written?
- Check if `/logs` directory exists
- Verify logger import: `import logger from '../utils/logger.js'`
- Check file permissions on `/logs` directory

### Logs contain "undefined" values?
- Use template strings or string concatenation
- Example: `logger.info(`User ID: ${userId}`)`

### Log files growing too large?
- Consider implementing log rotation
- Archive old logs periodically
- Set up cleanup scripts

---

## Integration with Monitoring Tools

For production environments, you can integrate logs with:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Datadog** - Add Datadog transport to Winston
- **CloudWatch** - For AWS deployments
- **Sentry** - For error tracking

Example for Sentry integration:
```typescript
import Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN });
logger.on('error', (error) => {
  Sentry.captureException(error);
});
```

---

## Summary

The logging system is now ready to use across your application. Start by:
1. Installing dependencies: `npm install winston morgan`
2. Replacing all `console.log` with `logger`
3. Checking `/logs` directory for persistent log files
4. Monitoring logs during development and production
