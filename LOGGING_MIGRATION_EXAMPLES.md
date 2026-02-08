# Logging Migration Examples

This file shows how to migrate existing code to use the new logging system.

## Example 1: Appointment Controller

### Before (using console.log)
```typescript
export const createAppointment = async (req: Request, res: Response) => {
    const { customerName, email, date, startTime, serviceId } = req.body;
    try {
        const appointment = await prisma.$transaction(async (tx:any) => {
            const conflict = await tx.appointment.findFirst({...})
            if (conflict) {
                throw new Error("SLOT_ALREADY_BOOKED");
            }
            return tx.appointment.create({...})
        });

        return res.status(201).json({ message: "Appointment created successfully", appointment });
    }
    catch (error: any) {
        console.error(error);  // ❌ Bad: No context
        return res.status(500).json({ message: "Something went wrong", error });
    }
}
```

### After (using Winston logger)
```typescript
import logger from '../utils/logger.js';

export const createAppointment = async (req: Request, res: Response) => {
    const { customerName, email, date, startTime, serviceId } = req.body;
    
    logger.info(`New appointment request: Customer=${customerName}, Service=${serviceId}, Date=${date}`);
    
    try {
        const appointment = await prisma.$transaction(async (tx:any) => {
            logger.debug(`Checking for conflicts: Service=${serviceId}, Time=${startTime}`);
            
            const conflict = await tx.appointment.findFirst({...})
            if (conflict) {
                logger.warn(`Slot conflict detected: Service=${serviceId}, Time=${startTime}`);
                throw new Error("SLOT_ALREADY_BOOKED");
            }
            
            return tx.appointment.create({...})
        });

        logger.info(`✓ Appointment created: ID=${appointment.id}, Customer=${customerName}`);
        return res.status(201).json({ message: "Appointment created successfully", appointment });
    }
    catch (error: any) {
        if (error.message === "SLOT_ALREADY_BOOKED") {
            logger.warn(`Appointment creation failed - slot conflict: ${customerName}`);
            return res.status(409).json({ message: "Slot already booked" });
        }
        
        logger.error(`Appointment creation error: ${error.message} | Stack: ${error.stack}`);
        return res.status(500).json({ message: "Something went wrong", error });
    }
}
```

---

## Example 2: Appointment Worker

### Before (using console.log)
```typescript
async function processBatch(batch: any[]) {
  const validAppointments = [];
  
  for (const appt of batch) {
    const conflict = await prisma.appointment.findFirst({...});
    
    if (!conflict) {
      validAppointments.push(appt);
    } else {
      console.log(`Skipping appointment for ${appt.customerName}: Slot already booked`);
    }
  }

  const insertedAppointments = await prisma.$transaction(...);
  
  for (const appt of insertedAppointments) {
    if (appt.email) {
      await sendConfirmationEmailJob({...});
    }
  }

  console.log(`Processed batch of ${validAppointments.length} valid appointments`);
}

const appointmentWorker = new Worker("appointmentQueue",
  async (job: Job) => {
    console.log("Reached here")
    // ... processing
    console.log("Appointment CSV processing complete!");
  }
);

appointmentWorker.on('completed', (job: Job) => {
  console.log(`${job.id} has completed!`);
});

appointmentWorker.on('failed', (job: Job, err: any) => {
  console.log(`${job.id} has failed with ${err.message}`);
});
```

### After (using Winston logger)
```typescript
import logger from '../utils/logger.js';

async function processBatch(batch: any[]) {
  logger.info(`Starting batch processing: ${batch.length} appointments`);
  
  const validAppointments = [];
  let skippedCount = 0;
  
  for (const appt of batch) {
    logger.debug(`Checking conflict for: ${appt.customerName} at ${appt.startTime}`);
    
    const conflict = await prisma.appointment.findFirst({...});
    
    if (!conflict) {
      validAppointments.push(appt);
      logger.debug(`✓ Valid appointment: ${appt.customerName}`);
    } else {
      skippedCount++;
      logger.warn(`⊘ Skipped appointment: ${appt.customerName} | Reason: Slot conflict`);
    }
  }

  try {
    logger.info(`Inserting ${validAppointments.length} valid appointments into database`);
    const insertedAppointments = await prisma.$transaction(...);
    
    for (const appt of insertedAppointments) {
      if (appt.email) {
        logger.debug(`Queuing confirmation email for: ${appt.email}`);
        await sendConfirmationEmailJob({...});
      }
    }
    
    logger.info(`✓ Batch processed: Valid=${validAppointments.length}, Skipped=${skippedCount}, Total=${batch.length}`);
  } catch (error: any) {
    logger.error(`Batch processing error: ${error.message}`);
    throw error;
  }
}

const appointmentWorker = new Worker("appointmentQueue",
  async (job: Job) => {
    const csv_path = job.data;
    logger.info(`Starting CSV import job: ID=${job.id}, File=${csv_path}`);
    
    try {
      const stream = fs.createReadStream(csv_path).pipe(csv());
      let batch = [];
      let rowCount = 0;

      for await (const row of stream) {
        rowCount++;
        logger.debug(`Processing CSV row ${rowCount}`);
        // ... process row
        
        if (batch.length === batch_size) {
          await processBatch(batch);
          batch = [];
        }
      }

      if (batch.length) {
        await processBatch(batch);
      }
      
      logger.info(`✓ CSV import completed: Job=${job.id}, Total rows=${rowCount}`);
    } catch (error: any) {
      logger.error(`CSV import failed: Job=${job.id}, Error=${error.message}`);
      throw error;
    }
  }
);

appointmentWorker.on('active', (job: Job) => {
  logger.info(`Job activated: ${job.id} (${job.name})`);
});

appointmentWorker.on('completed', (job: Job) => {
  logger.info(`✓ Job completed successfully: ${job.id}`);
});

appointmentWorker.on('failed', (job: Job, err: any) => {
  logger.error(`✗ Job failed: ${job.id} | Error: ${err.message}`);
});

appointmentWorker.on('error', (err: any) => {
  logger.error(`Appointment worker error: ${err.message}`);
});

logger.info(`Appointment worker started. Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
```

---

## Example 3: Auth Controller

### Before
```typescript
export const login = async function (req: Request, res: Response) {
    try{
        const user = await prisma.user.findFirst({
            where: { email: req.body.email }
        });

        if(!user){
            return res.status(400).json({ message: "User Not Found" });
        }

        console.log(user);  // ❌ Bad: Logs entire user object
        
        const token = jwtGenerator({...});
        const refreshToken = jwtGenerator({...});

        await prisma.UserSessions.create({...});

        return res.status(200).json({ message: "Login Successful", data:{token,refreshToken} });
    }
    catch(error){
        console.error(error);  // ❌ Generic error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}
```

### After
```typescript
import logger from '../utils/logger.js';

export const login = async function (req: Request, res: Response) {
    const { email } = req.body;
    logger.info(`Login attempt: ${email}`);
    
    try {
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            logger.warn(`Login failed - user not found: ${email}`);
            return res.status(400).json({ message: "User Not Found" });
        }

        if (!user.isEmailVerified) {
            logger.warn(`Login blocked - email not verified: ${email}`);
            return res.status(403).json({ message: "Please verify your email first" });
        }

        const token = jwtGenerator({...});
        const refreshToken = jwtGenerator({...});

        await prisma.UserSessions.create({...});

        logger.info(`✓ Login successful: ${email} | IP: ${req.ip}`);
        return res.status(200).json({ message: "Login Successful", data:{token,refreshToken} });
    }
    catch (error: any) {
        logger.error(`Login error for ${email}: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
```

---

## Example 4: Database Operations

### Before
```typescript
export const updateAppointment = async (appointmentId: number, data: any) => {
    try {
        const existing = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!existing) {
            return null;
        }

        const updated = await prisma.appointment.update({
            where: { id: appointmentId },
            data
        });

        return updated;
    }
    catch (error) {
        console.error(error);  // ❌ No context about what was being updated
        throw error;
    }
}
```

### After
```typescript
import logger from '../utils/logger.js';

export const updateAppointment = async (appointmentId: number, data: any) => {
    logger.info(`Starting appointment update: ID=${appointmentId}`);
    logger.debug(`Update data: ${JSON.stringify(data)}`);
    
    try {
        const existing = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!existing) {
            logger.warn(`Update failed - appointment not found: ID=${appointmentId}`);
            return null;
        }

        logger.debug(`Current appointment state: ${JSON.stringify(existing)}`);
        
        const updated = await prisma.appointment.update({
            where: { id: appointmentId },
            data
        });

        logger.info(`✓ Appointment updated successfully: ID=${appointmentId}`);
        return updated;
    }
    catch (error: any) {
        logger.error(`Database update error: ID=${appointmentId}, Error=${error.message}, Stack=${error.stack}`);
        throw error;
    }
}
```

---

## Step-by-Step Migration Checklist

- [ ] Install dependencies: `npm install winston morgan`
- [ ] Verify logger files are created in `src/utils/` and `src/middleware/`
- [ ] Update `src/app.ts` with logging middleware
- [ ] Replace `console.log` in controllers
- [ ] Replace `console.error` with proper error logging
- [ ] Replace `console.log` in workers
- [ ] Replace `console.log` in services
- [ ] Test logging by running the application
- [ ] Check `/logs` directory for generated log files
- [ ] Verify sensitive data is NOT being logged

---

## Common Patterns

### Pattern 1: Operation Started/Completed
```typescript
logger.info(`Starting operation: ${operationName}`);
try {
    // Do work
    logger.info(`✓ Operation completed: ${operationName}`);
} catch (error) {
    logger.error(`✗ Operation failed: ${operationName}, Error: ${error.message}`);
}
```

### Pattern 2: Validation Checks
```typescript
if (!data.email) {
    logger.warn(`Validation failed: missing email field`);
    return res.status(400).json({ message: "Email required" });
}
logger.debug(`Email validation passed: ${data.email}`);
```

### Pattern 3: Conflict Detection
```typescript
const conflict = await checkConflict(data);
if (conflict) {
    logger.warn(`Conflict detected: ${JSON.stringify(conflict)}`);
    return res.status(409).json({ message: "Conflict" });
}
logger.debug(`No conflicts detected`);
```

---

## Testing Logs

Once migrated, test by:

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Make API requests:**
   - Create appointment
   - Update appointment
   - Delete appointment
   - Login/Register

3. **Check log files:**
   ```bash
   cat logs/combined.log
   tail -f logs/error.log
   ```

4. **Look for entries:**
   - Request logs in `http.log`
   - Error traces in `error.log`
   - Processing details in `jobs.log`
