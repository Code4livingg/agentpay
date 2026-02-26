import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { defineChain } from 'viem';

export const polygonAmoy = defineChain({
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://amoy.polygonscan.com' },
  },
});

const amoyRpcUrl =
  process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL ||
  'https://rpc-amoy.polygon.technology';
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected({ shimDisconnect: true }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          metadata: {
            name: 'AgentPay',
            description: 'AgentPay dashboard wallet connection',
            url: 'http://localhost:3000',
            icons: ['https://amoy.polygonscan.com/favicon.ico'],
          },
          showQrModal: true,
        }),
      ]
    : []),
];

export const config = createConfig({
  chains: [polygonAmoy],
  connectors,
  transports: {
    [polygonAmoy.id]: http(amoyRpcUrl),
  },
  ssr: true,
});
