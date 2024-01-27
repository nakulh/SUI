import {notifyEvent} from '../accessor/telegramAccessor.js';
import {httpLog} from '../helper/logHelper.js';

export const notifySwapEvent = async (subscriberId, swapEvent) => {
    const res = await notifyEvent(subscriberId, getSwapEventMessage(swapEvent), getTxUrl(swapEvent.txId));
    httpLog.info(res);
}

const getTxUrl = (txId) => {
    return "https://suiscan.xyz/mainnet/tx/" + txId;
}

const getSwapEventMessage = (swapEvent) => {
    return `Wallet: ${swapEvent.wallet} #SWAPPED \n ${swapEvent.coinInQuantity} $${swapEvent.coinInSymbol} \n TO \n ${swapEvent.coinOutQuantity} $${swapEvent.coinOutSymbol}`;
}