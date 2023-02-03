import { useCallback, useEffect, useState } from "react";
import { TooltipProps } from "../../Utils";

const Tooltip = ({ scale, matrix, canvas, currentcolor }: TooltipProps) => {
    const [tooltip, setTooltip] = useState<HTMLDivElement | undefined>(undefined);
    const [colorSelection, setColorSelection] = useState<HTMLDivElement | undefined>(undefined);
    const [coords, setCoords] = useState<[number, number]>([0, 0]);
    const tooltipRef = useCallback((node: HTMLDivElement) => {
        if (node) {
            setTooltip(node);
        }
    }, []);

    useEffect(() => {
        if (!colorSelection) {
            return;
        }
        colorSelection.style["boxShadow"] = currentcolor + " 0px 0px 0px 15px inset";
    }, [currentcolor, colorSelection, tooltip])

    useEffect(() => {
        if (!canvas || !tooltip) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left);
            const y = (e.clientY - rect.top);
            if (!matrix[Math.floor(x / scale)][Math.floor(y / scale)]) {
                return;
            }
            setCoords([Math.floor(x / scale), Math.floor(y / scale)]);
            tooltip.style["transform"] = "translate(" + (x - tooltip.clientWidth / scale) + "px," + (y + tooltip.clientHeight + 10) + "px)";
        });

        return (() => {
            canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

            canvas.removeEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left);
                const y = (e.clientY - rect.top);
                setCoords([Math.floor(x / scale), Math.floor(y / scale)]);
                tooltip.style["transform"] = "translate(" + (x - tooltip.clientWidth / scale) + "px," + (y + tooltip.clientHeight + 10) + "px)";
            });
        })

    }, [canvas, tooltip, scale]);



    return (
        <div className="coordinate-tooltip" ref={tooltipRef}>
            <div>{"(" + coords[0] + ", " + coords[1] + ")"}</div>
            <div>{"#" + matrix[coords[0]][coords[1]].color}</div>
            {/* <div className="tooltip-color-outer">
                <span>
                    <div className="tooltip-color-selection" ref={colorSelectionRef}></div>
                </span>
            </div> */}
            <div>{(matrix[coords[0]][coords[1]].name !== 'null') ? matrix[coords[0]][coords[1]].name : (matrix[coords[0]][coords[1]].owner).substring(0, 10)}</div>
        </div>
    );
};

export default Tooltip;
