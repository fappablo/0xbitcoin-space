import { useRef, useState } from "react";
import { CirclePicker } from 'react-color';
import ShoppingCart from "./ShoppingCart";
import Tooltip from "./Tooltip";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState<string>('#000000');
    const [shoppingPixels, setShoppingPixels] = useState<[number, number, string][]>([]);

    const removeFromShoppingPixels = (i: number) => {
        if (!shoppingPixels || !canvasRef.current) {
            return;
        }

        const newPixels = [...shoppingPixels];
        const removedPixel = newPixels[i]
        newPixels.splice(i, 1);
        setShoppingPixels(newPixels);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            console.log("no context");

            return;
        }

        ctx.clearRect(removedPixel[0] * 10, removedPixel[1] * 10, 10, 10);
    }

    const addToShoppingPixels = (x: number, y: number, color: string) => {
        if (shoppingPixels.some((item, index) => {
            if (item[0] === x && item[1] === y && item[2] === color) {
                return true;
            } else if (item[0] === x && item[1] === y && item[2] !== color) {
                const newPixels = [...shoppingPixels];
                newPixels[index] = [x, y, color];
                setShoppingPixels(newPixels);
                return true;
            }
        })) {
            return;
        };

        const newPixels = [...shoppingPixels];
        newPixels.push([x, y, color]);
        setShoppingPixels(newPixels);
    };

    function handleCanvasClick(e: any) {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);
        ctx.fillStyle = color;

        addToShoppingPixels(Math.floor(x / 10), Math.floor(y / 10), color);

        ctx.fillRect(Math.floor(x / 10) * 10, Math.floor(y / 10) * 10, 10, 10);
    }


    return (
        <>
            <CirclePicker colors={["#000000", "#ffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]} className="circle-color-picker" onChange={(color: any, e: any) => { setColor(color.hex) }} />
            <div className="canvas-wrapper">
                <Tooltip canvas={canvasRef.current} currentcolor={color} />
                <canvas width={2000} height={2000} className="place-canvas" tabIndex={0} ref={canvasRef} onClick={handleCanvasClick}></canvas>
            </div>
            <ShoppingCart pixels={shoppingPixels} removePixel={removeFromShoppingPixels} />
        </>
    );
};

export default Canvas;
