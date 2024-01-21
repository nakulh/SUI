import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client';
import WebSocket from 'ws';
const net = "mainnet";
const MY_ADDRESS = '0x893170ac7be54475cfe15f7cdc07cb58ce042872bb04656c5a2efedaa3d89435';
const WEBSOCKET = "wss://rpc-mainnet.suiscan.xyz/websocket";
const BLUEMOVE_SWAP_PACKAGE_ID = "0xb24b6789e088b876afabca733bed2299fbc9e2d6369be4d1acfa17d8145454d9";
const CETUS5_SWAP_PKG_ID = "0x2eeaab737b37137b94bfa8f841f92e36a153641119da3456dec1926b9960d9be";
const CETUS6_SWAP_PKG_ID = "0x996c4d9480708fb8b92aa7acf819fb0497b5ec8e65ba06601cae2fb6db3312c3";
const FLOWX_SWAP_PKG_ID = "0xba153169476e8c3114962261d1edc70de5ad9781b83cc617ecc8c1923191cae0";

const suiClient = new SuiClient({
      transport: new SuiHTTPTransport({
          url: getFullnodeUrl(net),
          WebSocketConstructor: WebSocket,
      }),
});
  
const unsubscribe = await suiClient.subscribeEvent({
      filter: {
        Package: CETUS6_SWAP_PKG_ID
      },
      onMessage(event) {
        const eventType = event.type.toLowerCase();
        if (eventType.includes('swap')) {

            console.log(event);

            const transactionBlockInput = {
                digest: event.id.txDigest,
                options: {
                    showBalanceChanges: true
                }
            }
            getTransaction(transactionBlockInput);
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



