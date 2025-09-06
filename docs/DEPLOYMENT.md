# Home Essentials - Deployment Guide

This guide covers deploying the Home Essentials website to various hosting platforms.

## 🚀 Pre-Deployment Checklist

### Code Preparation
- [ ] All HTML files validated
- [ ] CSS optimized and minified
- [ ] JavaScript tested and error-free
- [ ] Images optimized for web
- [ ] All links and paths verified
- [ ] Cross-browser testing completed

### Content Review
- [ ] All placeholder content replaced
- [ ] Product information accurate
- [ ] Contact details updated
- [ ] Legal pages added (if required)
- [ ] Privacy policy and terms of service

### Performance Optimization
- [ ] Images compressed and properly formatted
- [ ] CSS and JavaScript minified
- [ ] Unused code removed
- [ ] Caching headers configured
- [ ] SEO meta tags optimized

## 🌐 Deployment Options

## Option 1: Netlify (Recommended for Static Sites)

### Why Netlify?
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Form handling for contact forms
- ✅ Easy domain management

### Deployment Steps

#### Method A: Drag and Drop
1. **Build the site** (if using build tools):
   ```bash
   # If you have a build process
   npm run build
   ```

2. **Visit Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up or log in

3. **Deploy**:
   - Drag and drop your project folder to the deploy area
   - Or zip the files and upload

4. **Configure**:
   - Set custom domain (optional)
   - Configure redirects if needed

#### Method B: Git Integration
1. **Push to Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/home-essentials.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Choose "New site from Git"
   - Connect your repository
   - Configure build settings

3. **Build Settings**:
   ```
   Build command: (leave empty for static sites)
   Publish directory: .
   ```

### Netlify Configuration

Create `netlify.toml` in root directory:
```toml
[build]
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "max-age=31536000"
```

## Option 2: Vercel

### Deployment Steps
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow prompts**:
   - Link to existing project or create new
   - Configure settings
   - Deploy

### Vercel Configuration

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=31536000"
        }
      ]
    }
  ]
}
```

## Option 3: GitHub Pages

### Deployment Steps
1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/home-essentials.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to Pages section
   - Choose source: Deploy from branch
   - Select main branch
   - Choose root folder

3. **Configure**:
   - Custom domain (optional)
   - Enforce HTTPS

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
```

## Option 4: Traditional Hosting (cPanel/FTP)

### Requirements
- Web hosting account with cPanel or FTP access
- Domain name
- SSL certificate

### Deployment Steps
1. **Prepare Files**:
   - Compress project folder
   - Ensure all paths are relative

2. **Upload via FTP**:
   ```bash
   # Using FileZilla or similar FTP client
   # Upload all files to public_html or www directory
   ```

3. **Set Permissions**:
   - Folders: 755
   - Files: 644

4. **Configure Domain**:
   - Point domain to hosting directory
   - Set up SSL certificate

### .htaccess Configuration

Create `.htaccess` file:
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🔧 Post-Deployment Configuration

### SSL Certificate
Ensure HTTPS is enabled:
- **Netlify/Vercel**: Automatic
- **GitHub Pages**: Enable in settings
- **Traditional Hosting**: Configure through hosting panel

### DNS Configuration
If using custom domain:
```
Type    Name    Value
A       @       [Your hosting IP]
CNAME   www     yourdomain.com
```

### Performance Monitoring

#### Google PageSpeed Insights
- Test: https://pagespeed.web.dev/
- Target: 90+ score on mobile and desktop

#### GTmetrix
- Test: https://gtmetrix.com/
- Target: Grade A, <3s load time

### Analytics Setup

#### Google Analytics 4
Add to all HTML files before `</head>`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Google Search Console
1. Verify domain ownership
2. Submit sitemap.xml
3. Monitor search performance

### Contact Form Integration

#### Netlify Forms
Add to contact form:
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <!-- form fields -->
</form>
```

#### Formspree Integration
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <!-- form fields -->
</form>
```

## 🔒 Security Best Practices

### Content Security Policy
Add to HTML head:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  script-src 'self' 'unsafe-inline' www.googletagmanager.com;
  img-src 'self' data: *.googleapis.com;
  connect-src 'self' www.google-analytics.com;
">
```

### Environment Variables
For sensitive data (API keys, etc.):
- **Netlify**: Site settings > Environment variables
- **Vercel**: Project settings > Environment variables
- **Traditional**: Server configuration

## 📊 Monitoring & Maintenance

### Uptime Monitoring
- Use services like UptimeRobot or Pingdom
- Set up alerts for downtime

### Performance Monitoring
- Regular PageSpeed Insights checks
- Monitor Core Web Vitals
- Set up automated testing

### Updates & Backups
- Regular content updates
- Security patches
- Backup hosting account data

### CDN Setup (Optional)
For better global performance:
- **Cloudflare**: Free tier available
- **AWS CloudFront**: Pay-per-use
- **Azure CDN**: Microsoft's solution

## 🚨 Troubleshooting

### Common Issues

**Site not loading**
- Check DNS propagation
- Verify hosting account status
- Check for SSL issues

**Images not displaying**
- Verify file paths
- Check image file permissions
- Ensure correct MIME types

**Contact form not working**
- Check form action URL
- Verify form handler setup
- Test form validation

**Poor performance**
- Optimize images
- Enable compression
- Check for render-blocking resources

### Support Resources
- Hosting provider documentation
- Community forums
- Professional web development services

---

**Ready to Deploy?** Follow the checklist above and choose the deployment option that best fits your needs and technical requirements.
