import { SwapEventBO } from '../model/swapEventBO.js';
import {ALLOWED_PACKAGES, BLUEMOVE_SWAP, BAYSWAP_SWAP, INTEREST_PROTOCOL_SWAP, SUISWAP_SWAP, TURBOS_SWAP, KRIYA_SWAP, AFTERMATH_SWAP, FLOWX_SWAP, CETUS_SWAP} from '../constants/swapConstants.js';
import {getSUIObject, getCoinData} from '../accessor/suiBlockchainAccessor.js';
import { coinCache, objectCache} from '../accessor/localCacheAccessor.js';

export const buildSwapEvent = async (event) => {
    const protocol = ALLOWED_PACKAGES[event.packageId];
    const payload = event.parsedJson;
    let swapEvent;
    switch (protocol) {
        case BLUEMOVE_SWAP:
            if (Number(payload.amount_x_in) > 0) {
                swapEvent = new SwapEventBO(event.id.txDigest, payload.pool_id, BLUEMOVE_SWAP, payload.token_x_in, payload.token_y_out, payload.amount_x_in, payload.amount_y_out, event.sender);
                break;
            }
            swapEvent = new SwapEventBO(event.id.txDigest, payload.pool_id, BLUEMOVE_SWAP, payload.token_y_in, payload.token_x_out, payload.amount_y_in, payload.amount_x_out, event.sender);
            break;
        case BAYSWAP_SWAP:
            var coinInfo = event.type.split("EventSwap")[1].split(", ");
            var coin1 = coinInfo[0].slice(1);
            var coin2 = coinInfo[1].slice(0, -1);
            if (Number(payload.x_in) > 0) {
                swapEvent = new SwapEventBO(event.id.txDigest, '', BAYSWAP_SWAP, coin1, coin2, payload.x_in, payload.y_in, event.sender);
                break;
            }
            swapEvent = new SwapEventBO(event.id.txDigest, '', BAYSWAP_SWAP, coin2, coin1, payload.y_in, payload.x_in, event.sender);
            break;
        case INTEREST_PROTOCOL_SWAP:
            swapEvent = new SwapEventBO();
        case SUISWAP_SWAP:
            var coinInfo = event.type.split("SwapTokenEvent")[1].split(", ");
            var coin1 = coinInfo[0].slice(1);
            var coin2 = coinInfo[1].slice(0, -1);
            if (payload.x_to_y) {
                swapEvent = new SwapEventBO(event.id.txDigest, '', SUISWAP_SWAP, coin1, coin2, payload.in_amount, payload.out_amount, event.sender);
                break;
            }
            swapEvent = new SwapEventBO(event.id.txDigest, '', SUISWAP_SWAP, coin2, coin1, payload.in_amount, payload.out_amount, event.sender);
            break;
        case TURBOS_SWAP:
            var coinInfo = await getCoinInfoFromPool(payload.pool);
            if (payload.a_to_b) {
                swapEvent = new SwapEventBO(event.id.txDigest, payload.pool, TURBOS_SWAP, coinInfo[0], coinInfo[1], payload.amount_a, payload.amount_b, event.sender);
                break;
            }
            swapEvent = new SwapEventBO(event.id.txDigest, payload.pool, TURBOS_SWAP, coinInfo[1], coinInfo[0], payload.amount_b, payload.amount_a, event.sender);
            break;
        case KRIYA_SWAP:
            var coinInfo = await getCoinInfoFromPool(payload.pool_id);
            let coinOut = event.type.split("SwapEvent")[1].slice(1,-1);
            if (coinOut == coinInfo[0]) {
                swapEvent = new SwapEventBO(event.id.txDigest, payload.pool_id, KRIYA_SWAP, coinInfo[0], coinInfo[1], payload.amount_in, payload.amount_out, event.sender);
                break;
            }
            swapEvent = new SwapEventBO(event.id.txDigest, payload.pool_id, KRIYA_SWAP, coinInfo[1], coinInfo[0], payload.amount_in, payload.amount_out, event.sender);
            break;
        case AFTERMATH_SWAP:
            if (Array.isArray(payload.types_in)) {
                swapEvent = new SwapEventBO(event.id.txDigest, payload.pool_id, AFTERMATH_SWAP, payload.types_in[0], payload.types_out[0], payload.amounts_in[0], payload.amounts_out[0], event.sender);
                break;
            }
            swapEvent = new SwapEventBO(event.id.txDigest, payload.pool_id, AFTERMATH_SWAP, payload.types_in, payload.types_out, payload.amounts_in, payload.amounts_out, event.sender);
            break;
        case FLOWX_SWAP:
            if (Number(payload.amount_x_in) > 0) {
                swapEvent = new SwapEventBO(event.id.txDigest, '', FLOWX_SWAP, payload.coin_x, payload.coin_y, payload.amount_x_in, payload.amount_y_out, event.sender);
                break
            }
            swapEvent = new SwapEventBO(event.id.txDigest, '', FLOWX_SWAP, payload.coin_y, payload.coin_x, payload.amount_y_in, payload.amount_x_out, event.sender);
            break;
        case CETUS_SWAP:
            var coinInfo = await getCoinInfoFromPool(payload.pool);
            if (payload.atob) {
                swapEvent = new SwapEventBO(event.id.txDigest, payload.pool, CETUS_SWAP, coinInfo[0], coinInfo[1], payload.amount_in, payload.amount_out, event.sender);
                break;
            }
            swapEvent = new SwapEventBO(event.id.txDigest, payload.pool, CETUS_SWAP, coinInfo[1], coinInfo[0], payload.amount_in, payload.amount_out, event.sender);
            break;
    }
    return enrichWithCoinInformation(swapEvent);
}

const getCoinInfoFromPool = async (poolId) => {
    let objectDetails;
    if (objectCache.has(poolId)) {
        objectDetails = objectCache.get(poolId);
    }
    else {
        objectDetails = await getSUIObject(poolId);
        objectCache.set(poolId, objectDetails);
    }
    /*console.log("POOL");
    console.log(objectDetails);
    console.log("POOL END");*/
    const coinInfo = objectDetails.data.type.split("Pool")[1].split(", ");
    const coin1 = coinInfo[0].slice(1);
    let coin2 = coinInfo[1];
    if (coin2[coin2.length - 1] == ">") {
        coin2 = coin2.slice(0, -1);
    }
    return [coin1, coin2];
}

const enrichWithCoinInformation = async (swapEvent) => {
    let cIn; let cOut;
    if (coinCache.has(swapEvent.coinIn)) {
        cIn = coinCache.get(swapEvent.coinIn);
    } else {
        cIn = await getCoinData(swapEvent.coinIn);
        coinCache.set(swapEvent.coinIn, cIn);
    }
    if (coinCache.has(swapEvent.coinOut)) {
        cOut = coinCache.get(swapEvent.coinOut);
    } else {
        cOut = await getCoinData(swapEvent.coinOut);
        coinCache.set(swapEvent.coinOut, cOut);
    }
    swapEvent.coinInSymbol = cIn.symbol;
    swapEvent.coinOutSymbol = cOut.symbol;
    swapEvent.coinInQuantity = swapEvent.coinInQuantity / (10**cIn.decimals);
    swapEvent.coinOutQuantity = swapEvent.coinOutQuantity / (10**cOut.decimals);
    return swapEvent;
}