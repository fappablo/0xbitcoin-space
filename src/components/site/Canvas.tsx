import { useEffect, useRef, useState } from "react";
import { SketchPicker } from 'react-color';
import ShoppingCart from "./ShoppingCart";
import Tooltip from "./Tooltip";
import JSZip from "jszip";
import { Web3Props } from "../../Utils";
import Button from "react-bootstrap/esm/Button";

const Canvas = ({ account, ensName, provider, loadWeb3Modal }: Web3Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sketchPickerRef = useRef<SketchPicker>(null);
    const [currentColor, setCurrentColor] = useState<string>("#000000")
    const [shoppingPixels, setShoppingPixels] = useState<[number, number, string][]>([]);
    const [pixelMatrix, setPixelMatrix] = useState(Array(500).fill(null).map(() => Array(500).fill({ color: '#FFFFFF', owner: '0x0', name: null })));
    const [isLoadingPixels, setIsLoadingPixels] = useState(true);
    const [scale, setScale] = useState(2);
    const [update, setUpdate] = useState(0);

    const setColor = (color: any) => {
        if (!sketchPickerRef || !sketchPickerRef.current) {
            return;
        }
        setCurrentColor(color.hex);
        sketchPickerRef.current.setState({ color: color.hex });
    }

    const removeFromShoppingPixels = (i: number) => {
        if (!shoppingPixels || !canvasRef.current) {
            return;
        }

        const newPixels = [...shoppingPixels];
        newPixels.splice(i, 1);
        setShoppingPixels(newPixels);
    }

    const clearPixels = () => {
        setShoppingPixels([]);
        if (!canvasRef.current || !pixelMatrix || isLoadingPixels) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        for (let i = 0; i < pixelMatrix.length; i++) {
            for (let j = 0; j < pixelMatrix[i].length; j++) {
                ctx.fillStyle = "#" + pixelMatrix[i][j].color;
                ctx.fillRect(i * scale, j * scale, scale, scale);
            }
        }
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
            return false;
        })) {
            return;
        };

        const newPixels = [...shoppingPixels];
        newPixels.push([x, y, color]);
        setShoppingPixels(newPixels);
    };

    function handleCanvasClick(e: any) {
        if (!canvasRef.current || !sketchPickerRef.current) {
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
        ctx.fillStyle = currentColor;

        addToShoppingPixels(Math.floor(x / scale), Math.floor(y / scale), currentColor);

        ctx.fillRect(Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale);
    }

    useEffect(() => {
        const matrix: any = [...pixelMatrix];
        setIsLoadingPixels(true);
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
                        matrix[pixel[0]][pixel[1]] = { color: pixel[2], owner: owner, name: value.name };
                    }
                }
                setPixelMatrix(matrix);
                setIsLoadingPixels(false);

            }, function error(e) {
                console.log(e);
            });

    }, [update])

    useEffect(() => {
        if (!canvasRef.current || !pixelMatrix) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        for (let i = 0; i < pixelMatrix.length; i++) {
            for (let j = 0; j < pixelMatrix[i].length; j++) {
                ctx.fillStyle = "#" + pixelMatrix[i][j].color;
                ctx.fillRect(i * scale, j * scale, scale, scale);
            }
        }

        for (let i = 0; i < shoppingPixels.length; i++) {
            ctx.fillStyle = shoppingPixels[i][2];
            ctx.fillRect(shoppingPixels[i][0] * scale, shoppingPixels[i][1] * scale, scale, scale);
        }


    }, [scale, canvasRef, pixelMatrix, isLoadingPixels])

    return (
        <>
            <SketchPicker ref={sketchPickerRef} color={currentColor} className="circle-color-picker" onChange={(color: any, e: any) => { setColor(color) }} />
            <div className="canvas-wrapper">
                <Tooltip scale={scale} matrix={pixelMatrix} canvas={canvasRef.current} />
                <canvas width={500 * scale} height={500 * scale} className="place-canvas" tabIndex={0} ref={canvasRef} onClick={handleCanvasClick}></canvas>
            </div>
            <ShoppingCart provider={provider} loadWeb3Modal={loadWeb3Modal} pixels={shoppingPixels} clearPixels={clearPixels} removePixel={removeFromShoppingPixels} />
            <div><Button onClick={() => setScale(scale + 1)}>+</Button><Button onClick={() => scale > 2 ? setScale(scale - 1) : null} > -</Button></div>
            <div><Button disabled={isLoadingPixels} onClick={() => setUpdate(update + 1)}>{isLoadingPixels ? "Loading" : "Update"}</Button></div>
        </>
    );
};

export default Canvas;
