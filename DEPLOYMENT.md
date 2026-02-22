# GitHub Pages Deployment Guide

This guide will help you deploy the Dev Handbook website to GitHub Pages.

## Quick Setup

### Step 1: Create GitHub Repository

1. Create a new repository on GitHub (e.g., `dev-handbook`)
2. Initialize and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dev-handbook.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### Step 3: Automatic Deployment

- The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
  - Build your site when you push to `main` branch
  - Deploy it to GitHub Pages
  - Your site will be live at: `https://YOUR_USERNAME.github.io/dev-handbook/`

## How It Works

1. **GitHub Actions Workflow**: 
   - Located at `.github/workflows/deploy.yml`
   - Triggers on push to `main` branch
   - Builds the project using `npm run build`
   - Deploys to GitHub Pages automatically

2. **Base Path Configuration**:
   - The workflow sets `BASE_URL=/dev-handbook/` for project pages
   - If your repo name is different, update the workflow file accordingly
   - For user/organization pages (`username.github.io`), change base to `/`

3. **HashRouter**:
   - The app uses `HashRouter` instead of `BrowserRouter` for better GitHub Pages compatibility
   - URLs will look like: `https://username.github.io/dev-handbook/#/languages`

## Custom Domain (Optional)

To use a custom domain:

1. Create a `CNAME` file in the `public` folder:
   ```
   yourdomain.com
   ```

2. Configure your DNS:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or add A records for GitHub Pages IPs

3. Update the base path in `vite.config.ts` to `/` if using a custom domain

## Troubleshooting

### Site not loading
- Check GitHub Actions workflow status
- Ensure GitHub Pages is enabled in repository settings
- Verify the base path matches your repository name

### Routes not working
- HashRouter is used for GitHub Pages compatibility
- All routes will have `#` in the URL (this is normal)

### Build fails
- Check Node.js version (should be 20+)
- Verify all dependencies are in `package.json`
- Check GitHub Actions logs for specific errors

## Manual Deployment

If you prefer manual deployment:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Or with custom base path
BASE_URL=/your-repo-name/ npm run build
```

Then manually push the `dist` folder to the `gh-pages` branch (though GitHub Actions handles this automatically).
