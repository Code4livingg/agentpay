'use client';

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatUnits } from 'viem';

const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
const USDC_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs font-mono text-white">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <div className="text-xs text-purple-400">
            {typeof usdcBalance === 'bigint' ? Number(formatUnits(usdcBalance, 6)).toFixed(2) : '0.00'} USDC
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-xs border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="text-xs bg-purple-600 hover:bg-purple-500 transition px-4 py-2 rounded-lg font-semibold"
    >
      Connect Wallet
    </button>
  );
}
