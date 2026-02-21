'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Demo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runDemo = async () => {
    setLogs([]);
    setDone(false);
    setRunning(true);

    const steps = [
      { text: '> Entering AgentPay Demo Agent...', delay: 300 },
      { text: '> Task: "Get current weather in Bangalore"', delay: 600 },
      { text: '> Thought: I need real-time weather data to complete this task', delay: 1200 },
      { text: '> Action: weather_api_tool', delay: 1800 },
      { text: '> Observation: API returned 402 Payment Required', delay: 2400 },
      { text: '>   Amount: 0.001 USDC (ERC-20, Polygon Amoy Testnet)', delay: 2700 },
      { text: '>   Recipient: 0x61254AEcF84eEdb890f07dD29f7F3cd3b8Eb2CBe', delay: 2900 },
      { text: '> AgentPay SDK: Pre-check for weather_agent...', delay: 3400 },
      { text: '>   ✅ Amount within per-tx limit ($1.00 max)', delay: 3700 },
      { text: '>   ✅ Recipient is whitelisted', delay: 3900 },
      { text: '>   ✅ Daily budget remaining: $4.999', delay: 4100 },
      { text: '>   → Forwarding to smart contract (final enforcement on-chain)', delay: 4400 },
      { text: '> Contract: executePayment(weather_agent, recipient, 0.001)', delay: 4900 },
      { text: '>   ✅ Contract check passed — tx submitted to Polygon Amoy', delay: 5400 },
      { text: '>   ✅ Tx confirmed: 0xMOCK_TX_weather_agent', delay: 5900 },
      { text: '>   Gas paid by: operator wallet | ~$0.0008 MATIC', delay: 6100 },
      { text: '> Observation: Weather data received — 28°C, Partly Cloudy', delay: 6600 },
      { text: '> Final Answer: Current weather in Bangalore is 28°C and partly cloudy.', delay: 7200 },
      { text: '---', delay: 7600 },
      { text: '> [Testing policy enforcement...]', delay: 8000 },
      { text: '> Attempting executePayment of $2.00 (exceeds $1.00 per-tx limit)', delay: 8500 },
      { text: '> Contract: ❌ REVERTED — exceeds maxPerTx limit', delay: 9000 },
      { text: '> No funds moved. On-chain revert confirmed.', delay: 9300 },
      { text: '---', delay: 9600 },
      { text: '> Session complete.', delay: 10000 },
      { text: '> Total spent: $0.001 USDC (Amoy Testnet) | Daily budget remaining: $4.999', delay: 10300 },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay - (steps[0].delay)));
      setLogs(prev => [...prev, step.text]);
    }

    setRunning(false);
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-sm text-purple-400 font-mono mb-1">
              🟣 Network: Polygon Amoy (Testnet)
            </div>
            <h1 className="text-3xl font-bold">Demo Runner</h1>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Back
          </Link>
        </div>

        <p className="text-gray-400 mb-6">
          Watch an AI agent autonomously pay for a weather API using AgentPay. 
          The agent detects the 402, checks policy, executes payment on-chain, 
          and retries — zero human clicks.
        </p>

        <button
          onClick={runDemo}
          disabled={running}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-6 py-3 rounded-lg font-semibold mb-6"
        >
          {running ? 'Running...' : done ? 'Run Again' : 'Run Demo Agent'}
        </button>

        {logs.length > 0 && (
          <div className="bg-black rounded-xl p-6 font-mono text-sm border border-gray-800">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`mb-1 ${
                  log.includes('❌') || log.includes('REVERTED')
                    ? 'text-red-400'
                    : log.includes('✅')
                    ? 'text-green-400'
                    : log.includes('Final Answer')
                    ? 'text-yellow-400'
                    : log.includes('---')
                    ? 'text-gray-600'
                    : 'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))}
            {running && <div className="text-purple-400 animate-pulse">▋</div>}
          </div>
        )}
      </div>
    </main>
  );
}
