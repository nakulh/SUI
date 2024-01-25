export class SwapEventBO {
    constructor(txId, poolId, protocol, coinIn, coinOut, coinInQuantity, coinOutQuantity, wallet) {
        this.txId = txId;
        this.protocol = protocol;
        this.coinIn = coinIn.split("::")[0].length == 64 ? "0x" + coinIn : coinIn;
        this.coinOut = coinOut.split("::")[0].length == 64 ? "0x" + coinOut : coinOut;;
        this.poolId = poolId;
        this.coinInQuantity = Number(coinInQuantity);
        this.coinOutQuantity = Number(coinOutQuantity);
        this.coinInSymbol = "";
        this.coinOutSymbol = "";
        this.wallet = wallet;
    }
}