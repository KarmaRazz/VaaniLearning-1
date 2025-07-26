# Vaani - HTTPS/SSL Deployment Guide

## HTTPS Configuration for Production Deployment

This guide helps you deploy Vaani with proper HTTPS/SSL support on various platforms.

### 1. Environment Variables Required

Create these environment variables in your deployment platform:

```bash
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secure_session_secret_32_chars_min
RESEND_API_KEY=your_resend_api_key_for_emails
```

### 2. Server Configuration

The server is now configured to:
- ✅ Trust proxy headers for HTTPS detection
- ✅ Force redirect HTTP → HTTPS in production
- ✅ Set secure cookie flags for HTTPS
- ✅ Add security headers (HSTS, XSS protection, etc.)

### 3. Platform-Specific Deployment Instructions

#### Replit Deployments
1. Click the "Deploy" button in Replit
2. Configure environment variables in the deployment settings
3. The deployment automatically provides HTTPS with `.replit.app` domain
4. Custom domains: Configure your domain's DNS to point to Replit's servers

#### Vercel
```bash
npm run build
vercel --prod
```
- Add environment variables in Vercel dashboard
- Vercel automatically provides HTTPS certificates

#### Railway
```bash
railway login
railway deploy
```
- Configure environment variables in Railway dashboard
- Railway automatically handles HTTPS

#### Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your_db_url
git push heroku main
```

### 4. Custom Domain HTTPS Setup

If using a custom domain:

1. **DNS Configuration**: Point your domain to your deployment platform
2. **SSL Certificate**: Most platforms auto-provision Let's Encrypt certificates
3. **Domain Verification**: Complete domain ownership verification
4. **Force HTTPS**: The server automatically redirects HTTP to HTTPS

### 5. Troubleshooting HTTPS Issues

#### Problem: "Not Secure" warning
**Solution**: Ensure `NODE_ENV=production` is set and deployment platform supports HTTPS

#### Problem: Cookies not working
**Solution**: Verify secure cookie settings are properly configured (already done)

#### Problem: Mixed content warnings
**Solution**: Ensure all assets (CSS, JS, images) are served over HTTPS

#### Problem: Redirect loops
**Solution**: Check if your platform already handles HTTPS (some platforms terminate SSL at load balancer)

### 6. Security Headers Included

The production build includes these security headers:
- `Strict-Transport-Security`: Forces HTTPS for 1 year
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Browser XSS filtering
- `Referrer-Policy`: Controls referrer information

### 7. Production Checklist

Before deploying:
- [ ] Set `NODE_ENV=production`
- [ ] Configure all required environment variables
- [ ] Ensure database is accessible from production
- [ ] Test HTTPS redirect functionality
- [ ] Verify secure cookie behavior
- [ ] Check all external API integrations work over HTTPS

### 8. Monitoring

After deployment, monitor:
- SSL certificate expiration (auto-renewed on most platforms)
- HTTPS redirect functionality
- Cookie authentication flow
- Security header presence

For issues specific to your deployment platform, consult their documentation for HTTPS configuration.