import json
import os
from typing import Any, Dict, List

import httpx
from openai import OpenAI


class DemoAgent:
    def __init__(self, backend_url: str | None = None):
        self.backend_url = (backend_url or os.getenv("BACKEND_URL", "http://127.0.0.1:8000")).rstrip("/")
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def _execute_demo(self) -> Dict[str, Any]:
        url = f"{self.backend_url}/execute-demo"
        print(f"[demo-agent] POST {url}")
        with httpx.Client(timeout=180) as client:
            resp = client.post(url)
            resp.raise_for_status()
            return resp.json()

    def run(self, task: str) -> Dict[str, Any]:
        if not os.getenv("OPENAI_API_KEY"):
            raise RuntimeError("OPENAI_API_KEY is required to run the demo agent")

        system_prompt = (
            "You are an autonomous payment agent. "
            "Use the execute_payment tool when you decide a payment should be executed."
        )

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "execute_payment",
                    "description": "Execute a USDC payment from the AgentVault",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "amount": {"type": "number"},
                            "recipient": {"type": "string"},
                            "reason": {"type": "string"},
                        },
                        "required": ["amount", "recipient", "reason"],
                    },
                },
            }
        ]

        messages: List[Dict[str, Any]] = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": task},
        ]

        steps: List[str] = [f"Task received: {task}"]

        print("[demo-agent] sending initial prompt")
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )

        choice = response.choices[0]
        tool_calls = choice.message.tool_calls or []
        steps.append("Model response received")

        if tool_calls:
            tool_call = tool_calls[0]
            steps.append("Tool call requested: execute_payment")
            args = json.loads(tool_call.function.arguments or "{}")
            steps.append(
                f"Requested payment: {args.get('amount')} USDC to {args.get('recipient')} "
                f"for {args.get('reason')}"
            )

            tx_result = self._execute_demo()
            tx_hash = tx_result.get("tx_hash")

            messages.append(
                {
                    "role": "assistant",
                    "tool_calls": [
                        {
                            "id": tool_call.id,
                            "type": "function",
                            "function": {
                                "name": "execute_payment",
                                "arguments": tool_call.function.arguments,
                            },
                        }
                    ],
                }
            )
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps({"tx_hash": tx_hash}),
                }
            )

            final = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
            )
            final_text = final.choices[0].message.content or ""
            steps.append(f"Final response: {final_text}")

            print("[demo-agent] conversation complete")
            print(json.dumps({"messages": messages, "steps": steps, "tx_hash": tx_hash}, indent=2))
            return {
                "tx_hash": tx_hash,
                "steps": steps,
                "response": final_text,
            }

        final_text = choice.message.content or ""
        steps.append("No tool call made by model")
        print(json.dumps({"messages": messages, "steps": steps, "response": final_text}, indent=2))
        return {"tx_hash": None, "steps": steps, "response": final_text}
