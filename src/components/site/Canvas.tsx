import { useEffect, useRef, useState } from "react";
import { SketchPicker } from 'react-color';
import ShoppingCart from "./ShoppingCart";
import Tooltip from "./Tooltip";
import JSZip from "jszip";
import { Web3Props } from "../../Utils";
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import { FaEraser, FaMinusCircle, FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const Canvas = ({ account, ensName, provider, loadWeb3Modal }: Web3Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sketchPickerRef = useRef<SketchPicker>(null);
    const [currentColor, setCurrentColor] = useState<string>("#000000")
    const [shoppingPixels, setShoppingPixels] = useState<[number, number, string][]>([]);
    const [pixelMatrix, setPixelMatrix] = useState(Array(500).fill(null).map(() => Array(500).fill({ color: '#FFFFFF', owner: '0x0', name: null })));
    const [isLoadingPixels, setIsLoadingPixels] = useState(true);
    const [scale, setScale] = useState(1);
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [eraserMode, setEraserMode] = useState(false);

    const fetchCanvas = () => {
        console.log("re-fetching canvas")
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
                //try again
                console.log(e);
            });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoUpdate) {
                fetchCanvas();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [autoUpdate]);

    useEffect(() => {
        fetchCanvas();
    }, []);

    const setColor = (color: any) => {
        if (!sketchPickerRef || !sketchPickerRef.current) {
            return;
        }
        setCurrentColor(color.hex);
        sketchPickerRef.current.setState({ color: color.hex });
    }

    const drawShoppingPixels = (newShoppingPixels: [number, number, string][]) => {
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

        for (let i = 0; i < newShoppingPixels.length; i++) {
            ctx.fillStyle = newShoppingPixels[i][2];
            ctx.fillRect(newShoppingPixels[i][0] * scale, newShoppingPixels[i][1] * scale, scale, scale);
        }
    }

    const removeFromShoppingPixels = (i: number) => {
        if (!shoppingPixels || !canvasRef.current) {
            return;
        }

        const newPixels = [...shoppingPixels];
        newPixels.splice(i, 1);
        setShoppingPixels(newPixels);
        drawShoppingPixels(newPixels);
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

    const addToShoppingPixelsBetter = (x: number, y: number, color: string) => {
        for (let i = 0; i < shoppingPixels.length; i++) {
            const pixel = { x: shoppingPixels[i][0], y: shoppingPixels[i][1], color: shoppingPixels[i][2] };
            if (pixel.x === x && pixel.y === y) {
                //already in the list
                if (pixel.color === color) {
                    return;
                }
                //preexisting pixel color
                if (color.toUpperCase() === ('#' + pixelMatrix[x][y].color).toUpperCase()) {
                    removeFromShoppingPixels(i);
                    return;
                }
                const newPixels = [...shoppingPixels];
                newPixels[i] = [x, y, color];
                setShoppingPixels(newPixels);
                return;
            }
        }
        if (color.toUpperCase() === ('#' + pixelMatrix[x][y].color).toUpperCase()) {
            return;
        }
        const newPixels = [...shoppingPixels];
        newPixels.push([x, y, color]);
        setShoppingPixels(newPixels);
    }

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
        const y = (e.clientY - rect.y);

        if (eraserMode) {
            const targetX = Math.floor(x / scale);
            const targetY = Math.floor(y / scale);
            for (let i = 0; i < shoppingPixels.length; i++) {
                const pixel = { x: shoppingPixels[i][0], y: shoppingPixels[i][1], color: shoppingPixels[i][2] };
                if (pixel.x === targetX && pixel.y === targetY) {
                    removeFromShoppingPixels(i);
                    return;
                }
            }
            return;
        }

        ctx.fillStyle = currentColor;

        ctx.fillRect(Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale);
        addToShoppingPixelsBetter(Math.floor(x / scale), Math.floor(y / scale), currentColor);
    }

    useEffect(() => {
        if (!wrapperRef || !canvasRef || !canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        wrapperRef.current!.scrollTop = (canvas.clientHeight - wrapperRef.current?.clientHeight!) / 2;
        wrapperRef.current!.scrollLeft = (canvas.clientWidth - wrapperRef.current?.clientWidth!) / 2;
    }, [wrapperRef, canvasRef]);

    useEffect(() => {
        if (!canvasRef.current || !pixelMatrix || !shoppingPixels) {
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
            <SketchPicker disableAlpha={true} ref={sketchPickerRef} color={currentColor} className="circle-color-picker" onChange={(color: any, e: any) => { setColor(color) }} />
            <div className="canvas-wrapper" ref={wrapperRef}>
                <Tooltip scale={scale} matrix={pixelMatrix} canvas={canvasRef.current} />
                <canvas width={500 * scale} height={500 * scale} className="place-canvas" tabIndex={0} ref={canvasRef} onClick={handleCanvasClick}></canvas>
            </div>
            <ShoppingCart account={account} provider={provider} loadWeb3Modal={loadWeb3Modal} pixels={shoppingPixels} clearPixels={clearPixels} removePixel={removeFromShoppingPixels} />
            <div className="scaling-buttons">
                <Button className="mr-1" onClick={() => setScale(scale + 1)}><FaPlusCircle /></Button>{' '}
                <Button onClick={() => scale > 1 ? setScale(scale - 1) : null} > <FaMinusCircle /></Button>{' '}
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                    <ToggleButton id="tbg-radio-1" value={1} onClick={() => setEraserMode(false)}>
                        <FaPencilAlt />
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={2} onClick={() => setEraserMode(true)}>
                        <FaEraser />
                    </ToggleButton>
                </ToggleButtonGroup> {' '}
                <Button disabled={isLoadingPixels} onClick={fetchCanvas}> <IoReloadOutline /></Button>{' '}
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Auto-Update"
                    onClick={() => setAutoUpdate(!autoUpdate)}
                    defaultChecked={true}
                />
            </div>
        </>
    );
};

export default Canvas;
