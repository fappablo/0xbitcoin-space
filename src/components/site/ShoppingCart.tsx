import { ReactElement, useEffect, useRef, useState } from "react";
import { ShoppingCartProps } from "../../Utils";
import Button from 'react-bootstrap/Button';
import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "../../contracts/src";
import { Web3Provider } from "@ethersproject/providers";
import { log } from "console";
import { remove } from "jszip";


const ShoppingCart = ({ provider, pixels, removePixel }: ShoppingCartProps) => {

    const [elements, setElements] = useState<ReactElement[]>();

    const purchasePixels = async () => {
        console.log(provider)
        if (provider === null) {
            return;
        }
        const contract = new Contract(
            addresses.place,
            abis.place,
            new Web3Provider(provider).getSigner(),
        );
        const x: number[] = [];
        const y: number[] = [];
        const colors: string[] = [];
        pixels?.forEach((item, index) => {
            x.push(item[0]);
            y.push(item[1]);
            colors.push("0x" + item[2].replace('#', ''));

        })
        await contract.placePixels(x, y, colors);
        pixels?.forEach((item, index) => {
            removePixel(index);
        })
    }

    useEffect(() => {
        const divs: ReactElement[] = [];
        if (pixels) {
            pixels.forEach((item, index) => {
                divs.push(
                    <div>
                        <div style={{ 'textShadow': `1px 1px ${item[2]}` }} className="coords">{"(" + item[0] + ", " + item[1] + ")"}</div>
                        <Button onClick={() => { removePixel(index) }}>Remove</Button >
                    </div>
                );
            });
        }
        setElements(divs);
    }, [pixels])

    return (
        <div className={"shopping-cart"}>
            <div className={"shopping-cart-list"}>{elements}</div>
            <Button onClick={purchasePixels}>Buy</Button>
        </div>
    );
};

export default ShoppingCart;
