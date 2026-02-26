# Contributing to AgentPay

Thanks for helping improve AgentPay.

## Setup
1. Fork the repo and create a feature branch.
2. Install backend deps: `pip install -r backend/requirements.txt`
3. Install frontend deps: `cd frontend && npm install`

## Development
1. Run backend: `uvicorn main:app --host 0.0.0.0 --port 8000`
2. Run frontend: `cd frontend && npm run dev`
3. Run demo script: `python3 backend/scripts/run_execute_demo.py --dry-run`

## Submitting
1. Ensure linting/tests (if any) are green.
2. Open a PR with a clear description and screenshots if UI changes.
