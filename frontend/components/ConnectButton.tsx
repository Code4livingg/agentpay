'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
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
