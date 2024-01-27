import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client';
import WebSocket from 'ws';

const suiClient = new SuiClient({
    transport: new SuiHTTPTransport({
        url: "https://sui-mainnet.public.blastapi.io",//getFullnodeUrl(net),
        WebSocketConstructor: WebSocket,
        websocket: {
          reconnectTimeout: 1000,
          url: 'wss://rpc-mainnet.suiscan.xyz/websocket',
        }
    }),
});

export const getSUIObject = async (objId) => {
    return suiClient.getObject({
        id: objId,
        options: {
            content: true,
            showDisplay: true,
            showType: true
        }
    });
}

export const getCoinData = async (coinId) => {
    return suiClient.getCoinMetadata({
        coinType: coinId
    });
}