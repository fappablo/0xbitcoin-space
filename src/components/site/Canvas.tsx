import { useEffect, useRef, useState } from "react";
import { SketchPicker } from 'react-color';
import ShoppingCart from "./ShoppingCart";
import Tooltip from "./Tooltip";
import JSZip from "jszip";
import { log } from "console";
import { Web3Props } from "../../Utils";

const Canvas = ({ account, ensName, provider, loadWeb3Modal }: Web3Props) => {
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

        addToShoppingPixels(Math.floor(x / 2), Math.floor(y / 2), color);

        ctx.fillRect(Math.floor(x / 2) * 2, Math.floor(y / 2) * 2, 2, 2);
    }

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const matrix: any = Array(500).fill(null).map(() => Array(500).fill({ color: '#FFFFFF', owner: '0x0', name: null }));

        fetch("https://0xbitcoin.xyz/map.zip", { mode: 'cors' })       // 1) fetch the url
            .then(function (response) {
                if (response.status === 200 || response.status === 0) {
                    return Promise.resolve(response.blob());
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
            .then(JSZip.loadAsync)                            // 3) chain with the zip promise
            .then(function (zip: any) {
                return zip.file("map.zip").async("string"); // 4) chain with the text content promise
            })
            .then(function success(rawdata) {                    // 5) display the result
                const map = new Map<string, { name: string, pixels: [number, number, string][] }>(JSON.parse(rawdata));
                for (const [owner, value] of map) { //owner=> {name: name, pixels: [x, y, color][]}
                    for (const pixel of value.pixels) {
                        matrix[pixel[0], pixel[1]] = { color: pixel[2], owner: owner, name: value.name };
                        ctx.fillStyle = "#" + pixel[2];
                        ctx.fillRect(pixel[0] * 2, pixel[1] * 2, 2, 2);
                    }
                }
            }, function error(e) {
                console.log(e);
            });
    }, [canvasRef])


    return (
        <>
            <SketchPicker color={"#FFFFa"} className="circle-color-picker" onChange={(color: any, e: any) => { setColor(color.hex) }} />
            <div className="canvas-wrapper">
                <Tooltip canvas={canvasRef.current} currentcolor={color} />
                <canvas width={1000} height={1000} className="place-canvas" tabIndex={0} ref={canvasRef} onClick={handleCanvasClick}></canvas>
            </div>
            <ShoppingCart provider={provider} pixels={shoppingPixels} removePixel={removeFromShoppingPixels} />
        </>
    );
};

export default Canvas;
