# Deployment Specification: Deno Deploy

## Overview

This document outlines the deployment strategy for the extract-content service on Deno Deploy,
including configuration, CI/CD pipelines, environment management, and operational procedures.

## Deployment Platform

### Deno Deploy

- **Platform**: Deno Deploy (https://deno.com/deploy)
- **Type**: Serverless edge platform
- **Runtime**: Deno 2.5+
- **Regions**: Multi-region (automatic global distribution)
- **Scaling**: Automatic horizontal scaling

### Why Deno Deploy?

1. **Native Deno Support**: Built specifically for Deno applications
2. **Edge Network**: Global CDN with low latency
3. **Zero Configuration**: Minimal setup required
4. **GitHub Integration**: Automatic deployments from Git
5. **Free Tier**: Generous free tier for testing and low-traffic apps
6. **Fast Cold Starts**: <100ms cold start times
7. **Built-in Observability**: Logs, metrics, and monitoring

## Prerequisites

### Accounts & Access

1. **GitHub Account**: Required for repository and CI/CD
2. **Deno Deploy Account**: Sign up at https://dash.deno.com
   - Link GitHub account for seamless integration
3. **Repository Access**: Appropriate permissions on the GitHub repository

### Local Development Setup

```bash
# Install Deno (if not already installed)
curl -fsSL https://deno.land/install.sh | sh

# Verify installation
deno --version  # Should show 2.5 or higher

# Install deployctl CLI (optional but recommended)
deno install -gArf jsr:@deno/deployctl
```

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

**Advantages:**

- Automatic deployments on push
- Preview deployments for pull requests
- Easy rollbacks
- Integrated with GitHub Actions
- No manual steps after initial setup

**Setup Steps:**

1. **Create Deno Deploy Project**
   - Go to https://dash.deno.com
   - Click "New Project"
   - Name: `extract-content` (or your preferred name)
   - Select: "Deploy from GitHub"

2. **Connect GitHub Repository**
   - Select organization: `netsi` (or your org)
   - Select repository: `extract-content`
   - Select branch: `deno-deploy-version`

3. **Configure Build Settings**
   ```yaml
   Branch: deno-deploy-version
   Entrypoint: main.ts
   Root directory: . (or leave blank)
   Build command: (leave empty, no build needed)
   Install command: (leave empty, Deno has no install step)
   ```

4. **Set Production Branch**
   - Production branch: `deno-deploy-version` (or `main` after merge)
   - Preview branches: All other branches (optional)

5. **Configure Environment Variables** (in Deno Deploy dashboard)
   ```
   PORT=8000  # Optional, Deno Deploy sets this automatically
   ```

### Method 2: CLI Deployment

**Advantages:**

- Quick testing
- Manual control
- No GitHub setup required
- Good for development

**Deployment Command:**

```bash
# One-time deployment
deployctl deploy --project=extract-content main.ts

# With specific production flag
deployctl deploy --project=extract-content --prod main.ts

# With environment variables
deployctl deploy --project=extract-content --env=.env main.ts
```

**CLI Configuration:**

```bash
# Login to Deno Deploy (first time only)
deployctl login

# Check deployment status
deployctl deployments list --project=extract-content

# View logs
deployctl logs --project=extract-content
```

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Deno Deploy

on:
  push:
    branches:
      - deno-deploy-version
  pull_request:
    branches:
      - deno-deploy-version

jobs:
  deploy:
    name: Deploy to Deno Deploy
    runs-on: ubuntu-latest

    permissions:
      id-token: write # Required for OIDC authentication
      contents: read # Required to clone repository
      pull-requests: write # Required for PR comments

    steps:
      - name: Clone repository
        uses: actions/checkout@v4

      - name: Setup Deno
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: Check TypeScript types
        run: deno check main.ts

      - name: Run linter
        run: deno lint

      - name: Run formatter check
        run: deno fmt --check

      - name: Run tests
        run: deno test --allow-net --allow-env

      - name: Deploy to Deno Deploy (Production)
        if: github.ref == 'refs/heads/deno-deploy-version' && github.event_name == 'push'
        uses: denoland/deployctl@v1
        with:
          project: extract-content
          entrypoint: main.ts
          root: .

      - name: Deploy to Deno Deploy (Preview)
        if: github.event_name == 'pull_request'
        uses: denoland/deployctl@v1
        with:
          project: extract-content
          entrypoint: main.ts
          root: .
```

### Workflow Triggers

1. **Push to `deno-deploy-version`**: Production deployment
2. **Pull Request**: Preview deployment with unique URL
3. **Manual**: Can be triggered manually from GitHub Actions UI

### Build & Test Pipeline

```
Checkout Code
    ↓
Setup Deno 2.x
    ↓
Type Check (deno check)
    ↓
Lint Code (deno lint)
    ↓
Format Check (deno fmt)
    ↓
Run Tests (deno test)
    ↓
[If all pass]
    ↓
Deploy to Deno Deploy
```

## Environment Configuration

### Environment Variables

**Development (.env.example):**

```bash
# Server Configuration
PORT=8000

# Deployment Info (auto-set by Deno Deploy)
# DENO_DEPLOYMENT_ID=auto-set
# DENO_REGION=auto-set
```

**Production (Deno Deploy Dashboard):**

- Set via: Project Settings → Environment Variables
- Variables are encrypted at rest
- Available to all deployments

**Accessing Environment Variables:**

```typescript
const port = Number(Deno.env.get("PORT")) || 8000;
const deploymentId = Deno.env.get("DENO_DEPLOYMENT_ID");
```

### Configuration Management

**deno.json (Production Configuration):**

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["deno.window", "deno.ns"]
  },
  "imports": {
    "@deno-dom": "jsr:@b-fuze/deno-dom@^0.1.48"
  },
  "tasks": {
    "start": "deno run --allow-net --allow-env main.ts",
    "dev": "deno run --allow-net --allow-env --watch main.ts"
  }
}
```

## Deployment Environments

### Development (Local)

```bash
# Run locally with hot reload
deno task dev

# Or directly
deno run --allow-net --allow-env --watch main.ts
```

**URL:** http://localhost:8000

### Preview (Deno Deploy)

- **Trigger**: Pull requests to `deno-deploy-version`
- **URL**: `https://extract-content-{pr-number}.deno.dev`
- **Purpose**: Testing changes before production
- **Lifetime**: Active while PR is open

### Production (Deno Deploy)

- **Trigger**: Push to `deno-deploy-version` branch
- **URL**: `https://extract-content.deno.dev` (or custom domain)
- **Purpose**: Live production traffic
- **Regions**: Global edge network

## Custom Domain Setup (Optional)

### Configure Custom Domain

1. **Add Domain in Deno Deploy Dashboard**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter: `api.yourdomain.com` (or subdomain of choice)

2. **Configure DNS Records**
   ```
   Type: CNAME
   Name: api (or your subdomain)
   Value: cname.deno.dev
   TTL: 3600 (or auto)
   ```

3. **SSL Certificate**
   - Automatically provisioned by Deno Deploy
   - Let's Encrypt certificates
   - Auto-renewal

4. **Verify Domain**
   - Wait for DNS propagation (up to 48 hours, usually <1 hour)
   - Deno Deploy will show "Active" when ready

### Domain Examples

```
Production: https://extract.yourdomain.com
Preview: https://extract-content-{sha}.deno.dev
Default: https://extract-content.deno.dev
```

## Monitoring & Observability

### Logs

**Access Logs via Dashboard:**

1. Go to https://dash.deno.com
2. Select project: `extract-content`
3. Click "Logs" tab
4. Filter by time range, log level, or search text

**Access Logs via CLI:**

```bash
# View live logs
deployctl logs --project=extract-content

# View logs for specific deployment
deployctl logs --project=extract-content --deployment={deployment-id}

# Filter by time
deployctl logs --project=extract-content --since=1h
```

**Log Levels:**

```typescript
console.log("Info message"); // Info
console.error("Error message"); // Error
console.warn("Warning message"); // Warning
```

### Metrics

**Available Metrics (Deno Deploy Dashboard):**

1. **Request Count**: Total requests per time period
2. **Response Time**: p50, p95, p99 latencies
3. **Error Rate**: 4xx and 5xx error percentages
4. **Bandwidth**: Data transferred in/out
5. **CPU Time**: Compute time consumed
6. **Memory**: Memory usage statistics

**Accessing Metrics:**

- Dashboard → Project → Analytics tab
- Time ranges: 1h, 24h, 7d, 30d
- Export data as CSV (future feature)

### Alerts (Future)

**Recommended Alert Conditions:**

1. Error rate > 5% for 5 minutes
2. p99 latency > 5 seconds for 5 minutes
3. Request count drops to 0 for 10 minutes
4. Deployment failure

## Rollback Procedures

### Automatic Rollback (GitHub)

```bash
# Revert the last commit
git revert HEAD
git push origin deno-deploy-version

# This triggers automatic redeployment of previous version
```

### Manual Rollback (Deno Deploy Dashboard)

1. Go to Project → Deployments
2. Find the deployment to rollback to
3. Click "⋯" → "Promote to Production"
4. Confirm promotion

### Manual Rollback (CLI)

```bash
# List recent deployments
deployctl deployments list --project=extract-content

# Redeploy a specific deployment
deployctl deployments redeploy --project=extract-content --id={deployment-id}
```

### Rollback Time

- **Typical**: 30-60 seconds
- **DNS Changes**: May take up to 5 minutes to propagate

## Health Checks & Status

### Health Check Endpoint

**Implement (Optional):**

```typescript
// Add to router.ts
if (url.pathname === "/health") {
  return new Response(
    JSON.stringify({
      status: "healthy",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      deployment: Deno.env.get("DENO_DEPLOYMENT_ID"),
    }),
    {
      headers: { "content-type": "application/json" },
    },
  );
}
```

**Usage:**

```bash
# Check health
curl https://extract-content.deno.dev/health

# Expected response:
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "deployment": "abc123xyz"
}
```

### Status Page

**Deno Deploy Status:**

- https://status.deno.com
- Subscribe to incident notifications
- Check during outages

## Security Configuration

### HTTPS/TLS

- **Automatic**: All Deno Deploy apps use HTTPS by default
- **Certificate**: Let's Encrypt (auto-renewed)
- **Protocols**: TLS 1.2, TLS 1.3
- **HTTP**: Automatically redirects to HTTPS

### Permissions

```typescript
// Required Deno permissions (auto-granted in Deno Deploy)
--allow - net; // HTTP server and fetching URLs
--allow - env; // Environment variables
```

### Access Control

- **Dashboard Access**: Managed via GitHub organization permissions
- **API Keys**: Not required for this public service
- **CORS**: Configured to allow all origins (as per current spec)

## Cost Estimation

### Deno Deploy Pricing (as of 2024)

**Free Tier:**

- 100,000 requests/day
- 100 GB bandwidth/month
- 100 ms CPU time per request
- Unlimited projects
- Custom domains

**Paid Tiers:**

- Pro: $20/month (1M requests, 100GB bandwidth)
- Business: Custom pricing

**Expected Cost for This Service:**

- **Low Traffic** (<100k requests/day): $0/month (free tier)
- **Medium Traffic** (~1M requests/day): $20/month (Pro tier)
- **High Traffic**: Scale based on usage

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] deno.json validated
- [ ] Type check passes (`deno check main.ts`)
- [ ] Linter passes (`deno lint`)
- [ ] Formatter check passes (`deno fmt --check`)

### Initial Deployment

- [ ] Deno Deploy project created
- [ ] GitHub repository connected
- [ ] Branch configured (`deno-deploy-version`)
- [ ] Entrypoint set (`main.ts`)
- [ ] Environment variables configured
- [ ] GitHub Actions workflow added
- [ ] Custom domain configured (optional)

### Post-Deployment Verification

- [ ] Application accessible at deployment URL
- [ ] All three endpoints responding correctly
  - [ ] `GET /` with extract parameter
  - [ ] `GET /html` with and without extract
  - [ ] `GET /raw` proxying correctly
- [ ] CORS headers present on all responses
- [ ] Error handling working (test with invalid parameters)
- [ ] Logs appearing in dashboard
- [ ] Metrics being collected

### Monitoring Setup

- [ ] Bookmark Deno Deploy dashboard
- [ ] Configure alerts (when available)
- [ ] Document deployment URLs
- [ ] Share access with team members

## Troubleshooting Guide

### Common Issues

**Issue 1: Deployment Fails with "Module not found"**

```
Solution:
- Check import paths in deno.json
- Verify import map configuration
- Ensure all imports use correct URLs or aliases
```

**Issue 2: Environment Variables Not Available**

```
Solution:
- Check environment variables in Deno Deploy dashboard
- Verify variable names match code
- Redeploy after adding new variables
```

**Issue 3: CORS Errors in Browser**

```
Solution:
- Verify CORS middleware is applied
- Check response headers in browser DevTools
- Ensure OPTIONS requests are handled
```

**Issue 4: Slow Response Times**

```
Diagnosis:
- Check target URL fetch times (not under our control)
- Review Deno Deploy metrics for cold starts
- Check for large HTML documents

Solution:
- Implement timeout on fetch operations
- Consider caching frequently accessed URLs
- Optimize deno-dom parsing
```

**Issue 5: Fetch Fails with CORS Error**

```
Solution:
- This is a server-side fetch, not affected by CORS
- Check if target URL is accessible
- Verify URL is valid and reachable
- Check network connectivity from Deno Deploy
```

## Best Practices

### Deployment

1. Always deploy to preview first (via PR)
2. Test preview deployment thoroughly
3. Monitor metrics after production deployment
4. Keep deployments small and incremental
5. Use descriptive commit messages for easy rollback identification

### Code Quality

1. Run `deno check` before pushing
2. Keep `deno lint` clean
3. Maintain test coverage
4. Use TypeScript strict mode
5. Document complex logic

### Monitoring

1. Check logs daily initially
2. Set up alerts for critical errors
3. Monitor response times
4. Track error rates
5. Review metrics weekly

### Security

1. Never commit secrets or API keys
2. Use environment variables for configuration
3. Validate all user inputs
4. Implement rate limiting (future)
5. Keep dependencies updated

## Additional Resources

### Documentation

- Deno Deploy Docs: https://docs.deno.com/deploy/
- Deno Manual: https://docs.deno.com/runtime/
- deployctl CLI: https://docs.deno.com/deploy/manual/deployctl

### Support

- Deno Discord: https://discord.gg/deno
- Deno Deploy Status: https://status.deno.com
- GitHub Issues: https://github.com/denoland/deploy_feedback

### Related Documentation

- [ARCHITECTURE_SPEC.md](./ARCHITECTURE_SPEC.md) - Technical architecture
- [API_SPEC.md](./API_SPEC.md) - API endpoints
- [TESTING_SPEC.md](./TESTING_SPEC.md) - Testing strategy
- [MIGRATION_SPEC.md](./MIGRATION_SPEC.md) - Migration from Node.js
