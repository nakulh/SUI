import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client';
import WebSocket from 'ws';
import { processSuiEvent } from './components/suiEventsProcessorComponent.js';
const net = "mainnet";
const MY_ADDRESS = '0x893170ac7be54475cfe15f7cdc07cb58ce042872bb04656c5a2efedaa3d89435';
const WEBSOCKET = "wss://rpc-mainnet.suiscan.xyz/websocket";
const BLUEMOVE_SWAP_PACKAGE_ID = "0xb24b6789e088b876afabca733bed2299fbc9e2d6369be4d1acfa17d8145454d9";
const CETUS5_SWAP_PKG_ID = "0x2eeaab737b37137b94bfa8f841f92e36a153641119da3456dec1926b9960d9be";
const CETUS6_SWAP_PKG_ID = "0x996c4d9480708fb8b92aa7acf819fb0497b5ec8e65ba06601cae2fb6db3312c3";
const FLOWX_SWAP_PKG_ID = "0xba153169476e8c3114962261d1edc70de5ad9781b83cc617ecc8c1923191cae0";
const KRIYA_PKG_ID = "0xa0eba10b173538c8fecca1dff298e488402cc9ff374f8a12ca7758eebe830b66";
const SUI_SWAP_PKG_ID = "0x361dd589b98e8fcda9a7ee53b85efabef3569d00416640d2faa516e3801d7ffc";
const TURBOS_SWAP_PKG_ID = "0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1";

const suiClient = new SuiClient({
      transport: new SuiHTTPTransport({
          url: "https://rpc-mainnet.suiscan.xyz:443",//getFullnodeUrl(net),
          WebSocketConstructor: WebSocket,
          websocket: {
            reconnectTimeout: 1000,
            url: 'wss://rpc-mainnet.suiscan.xyz/websocket',
          }
      }),
});
  
const unsubscribe = await suiClient.subscribeEvent({
      filter: {
        All: []
      },
      onMessage(event) {
        const eventType = event.type.toLowerCase();
        if (eventType.includes('swap') && !isBannedEvent(eventType)) {
            processSuiEvent(event);
            const transactionBlockInput = {
                digest: event.id.txDigest,
                options: {
                    showBalanceChanges: true
                }
            }
        }
      },
});

const getTransaction = (transactionBlockInput) => {
    suiClient.getTransactionBlock(transactionBlockInput)
        .then((response) => {
            console.log("##################");
            console.log(response)
            console.log("##################");
        }).catch((err) => {
            console.error(err);
        });
}

const printObject = (objId) => {
    suiClient.getObject({
        id: objId,
        options: {
            content: true,
            showDisplay: true,
            showType: true
        }
    }).then((response) => {
        console.log("##################");
        console.log(response)
        console.log("##################");
    })
}

const isBannedEvent = (eventType) => {
    if (eventType.includes("add") && (eventType.includes("pool") || eventType.includes("liquidity"))) {
        return true;
    }
    if (eventType.includes("remove") && (eventType.includes("pool") || eventType.includes("liquidity"))) {
        return true;
    }
    if (eventType.includes("supply") && (eventType.includes("pool") || eventType.includes("liquidity"))) {
        return true;
    }
    return false;
}



