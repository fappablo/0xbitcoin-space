import { ReactElement, useEffect, useState } from "react";
import { ShoppingCartProps } from "../../Utils";
import Button from 'react-bootstrap/Button';
import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "../../contracts/src";
import { Web3Provider } from "@ethersproject/providers";
import { useAlert } from "react-alert";

const PRICE_PER_PIXEL = 500000 / Math.pow(10, 8);

const ShoppingCart = ({ loadWeb3Modal, provider, account, pixels, removePixel, clearPixels }: ShoppingCartProps) => {
    const [elements, setElements] = useState<ReactElement[]>();
    const [allowance, setAllowance] = useState(0);
    const [balance, setBalance] = useState(0);

    const alert = useAlert();

    const updateBalanceAndAllowance = () => {
        const xbtcContract = new Contract(
            addresses.xbtc,
            abis.xbtc,
            new Web3Provider(provider).getSigner(),
        );

        xbtcContract.allowance(account, addresses.place).then((res: any) => setAllowance(parseInt(res)));
        xbtcContract.balanceOf(account).then((res: any) => setBalance(parseInt(res) / Math.pow(10, 8)));
    }

    const approve0xBTC = () => {
        const xbtcContract = new Contract(
            addresses.xbtc,
            abis.xbtc,
            new Web3Provider(provider).getSigner(),
        );
        const approvedAmount = 1000 * Math.pow(10, 8);
        let txhash: any;
        xbtcContract.approve(addresses.place, approvedAmount).then(async (res: any) => {
            txhash = res.hash;
            const web3provider = new Web3Provider(provider);
            let txn = await web3provider.waitForTransaction(txhash);
            if (txn.status) {
                updateBalanceAndAllowance();
                alert.success("Approved for spending \n You may now purchase Pixels");
            } else {
                alert.error("There was an error in the transaction");
            }
        }).catch((err: any) => { alert.error("There was an error\n" + err); });;
    }

    const purchasePixels = async () => {
        if (provider === null || !pixels) {
            return;
        }
        updateBalanceAndAllowance();
        if (balance < (pixels.length * PRICE_PER_PIXEL)) {
            alert.error("Insufficient balance \n Purchase 0xBTC first");
            return;
        }

        const placeContract = new Contract(
            addresses.place,
            abis.place,
            new Web3Provider(provider).getSigner(),
        );

        const x: number[] = [];
        const y: number[] = [];
        const colors: string[] = [];

        pixels.forEach((item,) => {
            x.push(item[0]);
            y.push(item[1]);
            colors.push("0x" + item[2].replace('#', ''));
        });

        let txhash: string, error;
        await placeContract.placePixels(x, y, colors).then(async (res: any) => {
            txhash = res.hash;
            const web3provider = new Web3Provider(provider);
            let txn = await web3provider.waitForTransaction(txhash);
            
            if (txn.status) {
                alert.success("Transaction succeded! \n Your pixels should appear in less than a minute");
            } else {
                alert.error("There was an error in the transaction");
            }

            setTimeout(() => {
                updateBalanceAndAllowance();
            }, 2000);

        }).catch((err: any) => { alert.error("There was an error\n" + err); });

        clearPixels();
    }

    useEffect(() => {
        if (!provider || !account) {
            return;
        }

        updateBalanceAndAllowance();
    }, [provider, account])

    useEffect(() => {
        const divs: ReactElement[] = [];
        if (pixels) {
            pixels.forEach((item, index) => {
                divs.push(
                    <div key={index}>
                        <div style={{ 'textShadow': `1px 1px ${item[2]}` }} className="coords">{"(" + item[0] + ", " + item[1] + ")"}</div>
                        <Button onClick={() => { removePixel(index) }}>Remove</Button >
                    </div>
                );
            });
        }
        setElements(divs);
    }, [pixels, removePixel])

    return (
        <div className={"shopping-cart"}>
            <div>{"Balance: " + balance + " 0xBTC"}</div>
            <div className={"shopping-cart-list"}>{elements}</div>
            <div>{pixels ? "Total: " + (pixels?.length * PRICE_PER_PIXEL).toFixed(3) + " 0xBTC" : "Total: 0 0xBTC"}</div>
            <Button onClick={provider ? (allowance ? purchasePixels : approve0xBTC) : loadWeb3Modal}>{provider ? (allowance ? "Buy" : "Approve") : "Connect"}</Button>
            <Button onClick={clearPixels}>Clear</Button>
        </div>
    );
};

export default ShoppingCart;
