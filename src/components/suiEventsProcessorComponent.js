import {ALLOWED_PACKAGES} from '../constants/swapConstants.js';
import {buildSwapEvent} from '../builder/swapEventBuilder.js';
import {processSwapEvent} from './swapEventProcessorComponent.js';
import {log} from '../helper/logHelper.js';

export const processSuiEvent = async (event) => {
    if (ALLOWED_PACKAGES[event.packageId] == undefined) {
        console.log(event.packageId + " is not allowed, hence skipping");
        return;
    }
    let swapEvent;
    try {
        swapEvent = await buildSwapEvent(event);
        log.info(swapEvent);
        processSwapEvent(swapEvent);
    } catch (err) {
        log.info("Swap Event Original");
        log.info(event);
        log.info("END Swap Event Original");
        log.info(err);
    }
}

/*await processSuiEvent({
    "id":{
    "txDigest":"FbyyMuUxDNTAMtfCqzjSfTi3kUj81D9PevVW8mL5pysk",
    "eventSeq":"0",
    },
    "packageId":"0xb24b6789e088b876afabca733bed2299fbc9e2d6369be4d1acfa17d8145454d9",
    "transactionModule":"router",
    "sender":"0x1c35c60674fe7c5d186edfa5e79482095af93aec5b625b661e7188fd23ebe3e1",
    "type":"0xb24b6789e088b876afabca733bed2299fbc9e2d6369be4d1acfa17d8145454d9::swap::Swap_Event<0x2::sui::SUI, 0xd9f9b0b4f35276eecd1eea6985bfabe2a2bbd5575f9adb9162ccbdb4ddebde7f::smove::SMOVE>",
    "parsedJson":{
    "amount_x_in":"1000000000",
    "amount_x_out":"0",
    "amount_y_in":"0",
    "amount_y_out":"11072804859",
    "pool_id":"0x41aecbafec6dddc032778f195fffe5cfbc8f8ba11e722902dc3448eee85c6059",
    "token_x_in":"0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
    "token_x_out":"0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
    "token_y_in":"d9f9b0b4f35276eecd1eea6985bfabe2a2bbd5575f9adb9162ccbdb4ddebde7f::smove::SMOVE",
    "token_y_out":"d9f9b0b4f35276eecd1eea6985bfabe2a2bbd5575f9adb9162ccbdb4ddebde7f::smove::SMOVE",
    "user":"0x1c35c60674fe7c5d186edfa5e79482095af93aec5b625b661e7188fd23ebe3e1",
    },
    "bcs":"5tdt9XCCRe4QDjAK2DqPxvuRnVX4J4YuUTRcqdJKAd4LRk6sZp947sS4wUZ7W1zcwcJh7wTXWW7BMebUNMFddRRm6weR67bWSWStUJMvAAAvm2mkzMtMhW4QGeb6H1JUz6NzKRgjq2GaUSDFnkR9nuUprvF9o4KGZFfBFW3QugdP9UL6HyHKTpHkN338pZ7ZKUnxbeJ1jG9AbgdS4fS99b7sZ2x8JHyEH52vCGV3o131G9rxZQFSXnFou4YhgFEjcARZEhc7Efh41GVN78uZVrPoDww1cEaq9oQ3TLvyfVNAsPNXW9ZfM5ao8jeJomEJJq6JCkvP3JTqxwB8GLnCdBiQzFYtYCUCpGSsHkWanGBXHmuUm9SKbZmf3Kxj76MrgAV7EQ47dVcZziVFV7pCp5d3Wumr32KuAtYKK3Ew3dVRhsyBYwZ72fhcoJoPDpWt3kmneSiARynvBXmmPzEUyLJiAcYTnzG7mdKVcUyCwrHCW7T9DGynQ5ecLPwx9AmDWZsutQinvxGYChi9wfwhyMWaeGc62UAfyWHSpNgF",
    "packageName":"Bluemove DEX",
    "packageImg":"https://strapi-dev.scand.app/uploads/Blue_Move_Logo_467f2dedf2.png",
    "senderName":"joebama.sui",
    "senderImg":"https://storage.googleapis.com/suins-nft-images/QmaLFg4tQYansFpyRqmDfABdkUVy66dHtpnkH15v1LPzcY.png",
    })*/