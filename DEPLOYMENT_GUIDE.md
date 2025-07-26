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

The server is now configured with enhanced HTTPS support:
- ✅ Trust proxy headers for HTTPS detection (multiple header formats supported)
- ✅ Force redirect HTTP → HTTPS on all platforms (not just production)
- ✅ Enhanced protocol detection (x-forwarded-proto, x-forwarded-protocol, x-url-scheme)
- ✅ Set secure cookie flags for HTTPS
- ✅ Add comprehensive security headers (HSTS, CSP, XSS protection, etc.)
- ✅ Automatic HTTPS detection for Replit, Vercel, Railway, Heroku, and other platforms

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

### 5. Enhanced HTTPS Configuration

The server now includes enhanced HTTPS detection and enforcement:

- **Multi-platform support**: Detects HTTPS headers from Replit, Vercel, Railway, Heroku, and others
- **Automatic redirects**: Forces HTTP to HTTPS on all non-localhost domains
- **Security headers**: HSTS, CSP, XSS protection automatically applied
- **Debug logging**: Console logs show redirect attempts for troubleshooting

### 6. Troubleshooting HTTPS Issues

#### Problem: "Not Secure" warning
**Solutions**:
1. Check browser console for redirect logs: `Redirecting HTTP to HTTPS`
2. Verify deployment platform provides SSL certificates
3. Ensure custom domain DNS is properly configured
4. Check if platform requires SSL certificate installation

#### Problem: Cookies not working
**Solution**: Verify secure cookie settings are properly configured (already done)

#### Problem: Mixed content warnings  
**Solution**: Ensure all assets (CSS, JS, images) are served over HTTPS

#### Problem: Redirect loops
**Solutions**:
1. Check server logs for redirect messages
2. Verify platform doesn't already handle HTTPS termination
3. Some platforms handle SSL at load balancer level

#### Problem: Platform-specific issues
**Replit**: SSL should work automatically with `.replit.app` domains
**Custom Domain**: Ensure DNS points to platform and SSL is enabled
**Cloudflare**: Check SSL/TLS setting is "Full" or "Full (strict)"

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