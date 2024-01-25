import {ALLOWED_PACKAGES} from '../constants/swapConstants.js';
import {buildSwapEvent} from '../builder/swapEventBuilder.js'

export const processSuiEvent = async (event) => {
    if (ALLOWED_PACKAGES[event.packageId] == undefined) {
        console.log(event.packageId + " is not allowed, hence skipping");
        return;
    }
    let swapEvent;
    try {
        swapEvent = await buildSwapEvent(event);
    } catch (err) {
        console.log("Processed SWAP event: ");
        console.log(swapEvent);
        console.log("END Swap Event");
        console.log("Swap Event Original");
        console.log(event);
        console.log("END Swap Event Original");

        console.log(err);
    }
    
    
}