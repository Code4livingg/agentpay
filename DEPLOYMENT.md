# AgentPay Production Deployment Guide

## Pre-Deployment Checklist

### Environment Variables

#### Backend (.env)
```bash
# Required
ALCHEMY_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_operator_wallet_private_key
AGENT_VAULT_ADDRESS=0x522996599e987d03cc9f07e77c3c11a3C23dE225
USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582

# Optional
MOCK_PAYMENT=false
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_AGENT_VAULT=0x522996599e987d03cc9f07e77c3c11a3C23dE225
NEXT_PUBLIC_POLICY_REGISTRY=0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6
NEXT_PUBLIC_USDC=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_POLYGONSCAN_URL=https://amoy.polygonscan.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/Code4livingg/agentpay
```

---

## Backend Deployment

### Option 1: Render / Railway / Fly.io

1. **Connect Repository**
   - Link GitHub repo to platform
   - Select `backend` as root directory

2. **Configure Build**
   ```bash
   # Build Command
   pip install -r requirements.txt
   
   # Start Command
   uvicorn main:app --host 0.0.0.0 --port 10000
   ```

3. **Set Environment Variables**
   - Add all variables from `.env`
   - Ensure `ALCHEMY_RPC` and `PRIVATE_KEY` are set

4. **Health Check**
   - Endpoint: `/health`
   - Expected: `{"status": "ok", "network": "Polygon Amoy Testnet"}`

### Option 2: Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 10000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
```

Build and run:
```bash
docker build -t agentpay-backend .
docker run -p 10000:10000 --env-file .env agentpay-backend
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Import GitHub repo to Vercel
   - Select `frontend` as root directory

2. **Configure Build**
   ```bash
   # Build Command (auto-detected)
   npm run build
   
   # Output Directory
   .next
   ```

3. **Set Environment Variables**
   - Add all `NEXT_PUBLIC_*` variables
   - Update `NEXT_PUBLIC_BACKEND_URL` to production backend URL

4. **Deploy**
   - Vercel auto-deploys on push to main
   - Custom domain: Configure in Vercel dashboard

### Option 2: Netlify

1. **Build Settings**
   ```bash
   # Build Command
   npm run build
   
   # Publish Directory
   .next
   ```

2. **Environment Variables**
   - Add all `NEXT_PUBLIC_*` variables in Netlify dashboard

---

## Post-Deployment Verification

### Backend Health Check
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "ok",
  "network": "Polygon Amoy Testnet"
}
```

### Frontend Verification
1. Visit deployed URL
2. Check wallet connect functionality
3. Verify contract addresses in footer
4. Test transaction table loading

### End-to-End Test
```bash
cd backend
source venv/bin/activate
python test_payment.py
```

Expected:
- Transaction executes successfully
- Receipt returned with block number and gas used
- Transaction appears in dashboard

---

## Monitoring

### Backend Logs
Monitor for:
- RPC connection errors
- Transaction failures
- Database write errors
- Environment variable issues

### Frontend Errors
Monitor for:
- API connection failures
- Wallet connection issues
- Transaction submission errors

### On-Chain Monitoring
- Watch AgentVault contract for `PaymentExecuted` events
- Monitor vault USDC balance
- Track daily spending per agent

---

## Security Considerations

### Backend
- Never commit `.env` file
- Use environment variables for all secrets
- Rotate `PRIVATE_KEY` periodically
- Monitor for unusual transaction patterns

### Frontend
- All contract addresses in environment variables
- No hardcoded secrets
- CORS configured for production domain only

### Smart Contracts
- Contracts are immutable once deployed
- Policy updates require owner signature
- Pause functionality available for emergencies

---

## Scaling Considerations

### Backend
- SQLite suitable for testnet/demo
- For production, migrate to PostgreSQL
- Consider Redis for caching
- Implement rate limiting

### Frontend
- Vercel handles auto-scaling
- CDN for static assets
- Optimize bundle size

### Blockchain
- RPC rate limits: Use Alchemy Growth plan for production
- Gas price monitoring: Implement dynamic gas pricing
- Transaction queuing: Handle high-frequency execution

---

## Troubleshooting

### Backend won't start
- Check all environment variables are set
- Verify RPC URL is accessible
- Ensure private key format is correct (no 0x prefix)

### Transactions failing
- Check wallet has sufficient MATIC for gas
- Verify vault has sufficient USDC balance
- Confirm agent is not paused
- Check policy limits (maxPerTx, dailyCap)

### Frontend not connecting
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check CORS configuration in backend
- Ensure wallet is on Polygon Amoy network

---

## Rollback Procedure

### Backend
1. Revert to previous deployment in platform dashboard
2. Verify health check passes
3. Monitor logs for errors

### Frontend
1. Revert deployment in Vercel/Netlify
2. Clear CDN cache if needed
3. Verify site loads correctly

### Smart Contracts
- Contracts are immutable
- Use pause functionality if needed
- Deploy new version if critical bug found

---

## Support

For deployment issues:
1. Check logs in deployment platform
2. Verify environment variables
3. Test locally first
4. Open GitHub issue with error details

---

**AgentPay** — Production-grade payment infrastructure for autonomous agents.
