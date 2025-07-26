import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { createTestUser } from "./create-test-user";
import { seedGoalsAndSubjects } from "./seed-goals-subjects";
import { AdminAuth } from "./admin-auth";

const app = express();

// Trust proxy for HTTPS/SSL (important for deployment)
app.set('trust proxy', 1);

// Enhanced HTTPS enforcement and security headers
// Force HTTPS redirect for any deployment platform
app.use((req, res, next) => {
  // Check multiple headers that different platforms use
  const proto = req.header('x-forwarded-proto') || 
                req.header('x-forwarded-protocol') || 
                req.header('x-url-scheme') ||
                (req.connection && (req.connection as any).encrypted ? 'https' : 'http');
  
  const host = req.header('host');
  
  // Force HTTPS redirect if not already HTTPS and not localhost
  if (proto !== 'https' && host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    console.log(`Redirecting HTTP to HTTPS: ${proto}://${host}${req.url}`);
    return res.redirect(301, `https://${host}${req.url}`);
  }
  
  next();
});

// Security headers for all environments (not just production)
app.use((req, res, next) => {
  const host = req.header('host');
  
  // Only set HSTS for HTTPS connections
  if (req.header('x-forwarded-proto') === 'https' || (req.connection && (req.connection as any).encrypted)) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Always set these security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;");
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static('public/uploads'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Seed database with initial data
  await seedDatabase();
  
  // Seed goals and subjects
  await seedGoalsAndSubjects();
  
  // Create test user account
  await createTestUser();
  
  // Initialize default admin account
  await AdminAuth.initializeDefaultAdmin();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
