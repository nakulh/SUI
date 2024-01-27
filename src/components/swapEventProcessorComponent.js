import {getAllSubscribersToWallet} from '../accessor/dynamoDBAccessor.js';
import {notifySwapEvent} from '../helper/telegramHelper.js';
import {subscriberCache} from '../accessor/localCacheAccessor.js';
import {log} from '../helper/logHelper.js';

export const processSwapEvent = (swapEvent) => {
    if (subscriberCache.has(swapEvent.wallet)) {
        console.log("subscribers cache hit");
        notifySubscribersAboutSwapEvent(subscriberCache.get(swapEvent.wallet), swapEvent);
        return;
    }
    let queryWallet = swapEvent.wallet;
    if (queryWallet.length > 64) {
        queryWallet = queryWallet.slice(2);
    }
    getAllSubscribersToWallet(queryWallet, (subscribersList, err) => {
        if (err) {
            log.error(err);
            return;
        }
        subscriberCache.set(swapEvent.wallet, subscribersList);
        notifySubscribersAboutSwapEvent(subscribersList, swapEvent);
    })
}

const notifySubscribersAboutSwapEvent = (subscribersList, swapEvent) => {
    subscribersList.forEach((subscriber) => {
        notifySwapEvent(subscriber.id, swapEvent);
    });
}