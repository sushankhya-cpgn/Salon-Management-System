# Logging System - Quick Setup Guide

## Installation Steps

### 1. Install Winston and Morgan

```bash
npm install winston morgan
# or
npm install winston@3.11.0 morgan@1.10.0
```

### 2. Updated Files

The following files have been created and updated:

**New Files Created:**
- `src/utils/logger.ts` - Main Winston logger configuration
- `src/middleware/morganMiddleware.ts` - HTTP request logging middleware
- `src/middleware/loggingMiddleware.ts` - Custom request/error logging

**Files Updated:**
- `src/app.ts` - Added logging middleware integration

### 3. Start Using Logs

The logging middleware is **automatically active**. Just import the logger in your files:

```typescript
import logger from '../utils/logger.js';

// Use it
logger.info('This is an info message');
logger.error('This is an error');
logger.warn('This is a warning');
logger.debug('This is debug info');
```

---

## What Gets Logged Automatically

✅ **Automatically tracked:**
1. All HTTP requests/responses (via Morgan)
2. Request body for POST/PATCH requests
3. Response status codes and response times
4. Request IP and user information
5. Errors and exceptions

✅ **You need to add manually:**
- Business logic operations
- Database queries and results
- Background job progress
- Authentication events

---

## Directory Structure

After first run, you'll see:

```
project-root/
├── logs/
│   ├── combined.log      (all logs)
│   ├── error.log         (errors only)
│   ├── info.log          (info level)
│   ├── http.log          (HTTP requests/responses)
│   ├── database.log      (DB operations - when you add logging)
│   └── jobs.log          (background jobs - when you add logging)
└── src/
    └── ... (rest of code)
```

**Add to `.gitignore:`**
```
logs/
*.log
```

---

## Common Tasks

### View All Logs (Real-time)
```bash
tail -f logs/combined.log
```

### View Only Errors
```bash
tail -f logs/error.log
```

### Search Logs
```bash
grep "appointment" logs/combined.log
grep "error" logs/error.log
```

### Count Logs by Type
```bash
grep -c "error" logs/combined.log
grep -c "info" logs/combined.log
```

---

## Quick Reference

### Log Levels (in order of importance)
1. `logger.error()` - Critical errors
2. `logger.warn()` - Warnings
3. `logger.info()` - General info  ← Most commonly used
4. `logger.http()` - HTTP details
5. `logger.debug()` - Debug info

### Example in Controller
```typescript
import logger from '../utils/logger.js';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        logger.info(`Creating appointment: ${req.body.customerName}`);
        
        const appointment = await prisma.appointment.create({...});
        
        logger.info(`✓ Appointment created: ID=${appointment.id}`);
        res.status(201).json({ appointment });
    } catch (error: any) {
        logger.error(`Failed to create appointment: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
```

---

## Next Steps

1. ✅ Install dependencies: `npm install winston morgan`
2. ✅ Verify new files are in place
3. ✅ Start application: `npm run dev`
4. ✅ Check that logs directory is created
5. ✅ Make API requests to generate logs
6. ✅ Review log files in `/logs` directory
7. 📝 Replace existing `console.log` statements with logger
   - See [LOGGING_MIGRATION_EXAMPLES.md](LOGGING_MIGRATION_EXAMPLES.md) for examples
8. 📝 Add logger to workers, jobs, and services
   - See [LOGGING_GUIDE.md](LOGGING_GUIDE.md) for usage guide

---

## Verify Installation

After installation, test with:

```bash
# 1. Start server
npm run dev

# 2. Make a request (from another terminal)
curl http://localhost:3000/

# 3. Check logs exist
ls logs/

# 4. View logs
cat logs/combined.log
```

You should see requests logged in:
- Console (with colors)
- `logs/http.log` (all requests)
- `logs/combined.log` (all logs)

---

## Environment Configuration (Optional)

Control log level via `.env`:

```env
# In .env file (defaults to 'debug' if not set)
LOG_LEVEL=info
```

Log levels: `error` | `warn` | `info` | `http` | `debug`

---

## Support Files

- **[LOGGING_GUIDE.md](LOGGING_GUIDE.md)** - Complete logging documentation
- **[LOGGING_MIGRATION_EXAMPLES.md](LOGGING_MIGRATION_EXAMPLES.md)** - Before/after code examples
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API documentation

---

## Summary

✅ **What's ready:**
- Logger configured with Winston
- HTTP logging with Morgan  
- 6 different log files for different purposes
- Automatic middleware for requests/responses
- Full documentation with examples

🔄 **What to do next:**
- Install dependencies
- Replace `console.log/console.error` in your code
- View logs in `/logs` directory
