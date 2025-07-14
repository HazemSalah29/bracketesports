# GitHub Deployment Setup for BracketEsports

## Required GitHub Secrets

To enable automated deployment to GoDaddy, you need to set up the following secrets in your GitHub repository:

### Setting up GitHub Secrets

#### Method 1: Direct URL (Recommended)

Go directly to: `https://github.com/HazemSalah29/bracketesports/settings/secrets/actions`

#### Method 2: Through Repository Settings

1. Go to your GitHub repository: `https://github.com/HazemSalah29/bracketesports`
2. Click on **Settings** tab (make sure you're in the repository, not your profile)
3. In the left sidebar, look for:
   - **"Secrets and variables"** → **"Actions"**
   - OR just **"Secrets"**
   - OR **"Environments"**
4. Click **New repository secret** for each of the following:

#### Method 3: If Secrets Tab is Missing

- Ensure you have **admin/write access** to the repository
- Try accessing via **Actions** tab → **"New workflow"** → **"set up secrets"**
- Contact repository owner to add you as collaborator with proper permissions

### Required Secrets

#### FTP Deployment Secrets

- **`FTP_SERVER`**: Your GoDaddy FTP server (usually your domain or IP)
  - Example: `bracketesports.com` or `ftp.bracketesports.com`
- **`FTP_USERNAME`**: Your GoDaddy FTP username
  - Example: `username@bracketesports.com`
- **`FTP_PASSWORD`**: Your GoDaddy FTP password
  - Your hosting account password

#### Database & API Secrets

- **`MONGODB_URI`**: Your MongoDB Atlas connection string
  - Example: `mongodb+srv://username:password@bracketesports-prod.6w6yjfb.mongodb.net/bracketesports?retryWrites=true&w=majority`
- **`JWT_SECRET`**: Strong secret key for JWT tokens
  - Example: `your-super-secret-jwt-key-here-make-it-long-and-random`
- **`CORS_ORIGIN`**: Your domain URL
  - Example: `https://bracketesports.com`

### How to Add Secrets

1. **FTP_SERVER**:

   - Name: `FTP_SERVER`
   - Value: `bracketesports.com` (or your FTP server)

2. **FTP_USERNAME**:

   - Name: `FTP_USERNAME`
   - Value: Your FTP username from GoDaddy

3. **FTP_PASSWORD**:

   - Name: `FTP_PASSWORD`
   - Value: Your FTP password from GoDaddy

4. **MONGODB_URI**:

   - Name: `MONGODB_URI`
   - Value: Your complete MongoDB Atlas connection string

5. **JWT_SECRET**:

   - Name: `JWT_SECRET`
   - Value: A long, random string for JWT signing

6. **CORS_ORIGIN**:
   - Name: `CORS_ORIGIN`
   - Value: `https://bracketesports.com`

## Getting GoDaddy FTP Details

1. Log into your GoDaddy account
2. Go to **My Products** → **Web Hosting**
3. Click **Manage** next to your hosting plan
4. In cPanel, look for **File Manager** or **FTP Accounts**
5. Your FTP details will be:
   - **Server**: Usually your domain name
   - **Username**: Usually your main cPanel username
   - **Password**: Your cPanel password

## MongoDB Atlas Setup

Your MongoDB connection string should already be configured:

```
mongodb+srv://hazemsalah:W123456789w@bracketesports-prod.6w6yjfb.mongodb.net/bracketesports?retryWrites=true&w=majority
```

## Manual Deployment (If GitHub Secrets Not Available)

If you can't access GitHub Secrets, you can deploy manually:

### Option 1: PowerShell Script (Windows)

```powershell
# Set environment variables for this session
$env:MONGODB_URI = "mongodb+srv://hazemsalah:W123456789w@bracketesports-prod.6w6yjfb.mongodb.net/bracketesports?retryWrites=true&w=majority"
$env:JWT_SECRET = "your-super-secret-jwt-key-2024-production"
$env:CORS_ORIGIN = "https://bracketesports.com"

# Run deployment script
.\scripts\deploy-godaddy.ps1
```

### Option 2: Bash Script (Linux/Mac/WSL)

```bash
# Set environment variables
export MONGODB_URI="mongodb+srv://hazemsalah:W123456789w@bracketesports-prod.6w6yjfb.mongodb.net/bracketesports?retryWrites=true&w=majority"
export JWT_SECRET="your-super-secret-jwt-key-2024-production"
export CORS_ORIGIN="https://bracketesports.com"

# Run deployment script
./scripts/deploy-godaddy.sh
```

### Option 3: Use Existing Deploy Folder

Your project already has a ready deployment in the `deploy/` folder:

1. Upload `deploy/public_html/*` to your GoDaddy `public_html/` directory
2. Upload `deploy/api/*` to your GoDaddy `public_html/api/` directory
3. Update environment variables in `deploy/api/.env`

## Deployment Process

Once secrets are configured:

1. **Automatic Deployment**: Push changes to `main` branch

   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Manual Deployment**: Go to Actions tab and run "Deploy to GoDaddy" workflow

## Deployment Structure

The deployment creates:

```
public_html/
├── index.html (Landing page)
├── .htaccess (Routing rules)
├── images/ (Static assets)
└── api/ (PHP-based API - GoDaddy compatible!)
    └── index.php (Main API handler)
```

## Testing Deployment

After deployment:

1. Visit: `https://bracketesports.com`
2. Test API: `https://bracketesports.com/api/health`
3. Check database connectivity

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**:

   - Check if `index.html` exists in public_html
   - Verify `.htaccess` file permissions
   - Ensure file permissions are 644

2. **API Not Working**:

   - PHP should work on all GoDaddy shared hosting plans
   - Check .htaccess file permissions and syntax
   - Verify API routing rules are correct

3. **Database Connection Failed**:
   - Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
   - Check connection string format
   - Ensure database user has proper permissions

### Manual Deployment (Backup)

If GitHub Actions fail, you can manually deploy:

1. Run the deployment script:

   ```bash
   ./scripts/deploy-godaddy.sh
   ```

2. Upload `deploy/` contents via FTP:
   - Upload `deploy/public_html/*` to `public_html/`
   - Upload `deploy/api/*` to `public_html/api/`

## Security Notes

- Never commit sensitive data to Git
- Keep FTP credentials secure
- Regularly rotate JWT secrets
- Monitor MongoDB Atlas access logs
- Enable SSL certificate in GoDaddy

## Support

For deployment issues:

1. Check GitHub Actions logs
2. Verify all secrets are correctly set
3. Test FTP connection manually
4. Check GoDaddy hosting support for Node.js setup

## 🚨 FTP Deployment Error - Quick Fix Guide

### The Problem
Your GitHub Actions deployment is failing with:
```
Error: getaddrinfo ENOTFOUND ***
Failed to connect, are you sure your server works via FTP or FTPS?
```

This means the FTP server address cannot be found, indicating missing or incorrect GitHub Secrets.

### ✅ IMMEDIATE SOLUTION: Manual Deployment

I've created a ready-to-deploy package in the `deploy/` folder:

📁 **Deployment Package Created:**
- `deploy/public_html/index.html` - Beautiful landing page with API testing
- `deploy/public_html/api/index.php` - PHP-based API (GoDaddy compatible)
- `deploy/public_html/.htaccess` - Server configuration

**🔧 Upload Instructions:**
1. **Access GoDaddy File Manager:**
   - Login to GoDaddy → My Products → Web Hosting → Manage
   - Open File Manager or cPanel

2. **Upload Files:**
   - Navigate to `public_html/` folder
   - Upload ALL contents from `deploy/public_html/` to your `public_html/`
   - Make sure to upload:
     - `index.html` (main page)
     - `api/index.php` (API endpoint)
     - `.htaccess` (configuration)

3. **Test Deployment:**
   - Visit: `https://bracketesports.com`
   - Test API: `https://bracketesports.com/api/health`

### 🔧 LONG-TERM SOLUTION: Fix GitHub Actions
