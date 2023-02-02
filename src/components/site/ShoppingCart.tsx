import { ReactElement, useEffect, useRef, useState } from "react";
import { ShoppingCartProps } from "../../Utils";
import Button from 'react-bootstrap/Button';

const ShoppingCart = ({ pixels, removePixel }: ShoppingCartProps) => {

    const [elements, setElements] = useState<ReactElement[]>();

    function purchasePixels() {
        console.log(pixels);

    }

    useEffect(() => {
        const divs: ReactElement[] = [];
        if (pixels) {
            pixels.forEach((item, index) => {
                divs.push(
                    <div>
                        <div className="coords">{"x: " + item[0] + " y: " + item[1]}</div>
                        <div className="tooltip-color-outer">
                            <span>
                                <div className={"cart-color-section"} style={{ 'boxShadow': `${item[2]} 0px 0px 0px 15px inset` }}></div>
                            </span>
                        </div>
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
