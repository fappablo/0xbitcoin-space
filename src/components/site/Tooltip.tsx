import { useCallback, useEffect, useState } from "react";
import { TooltipProps } from "../../Utils";

const Tooltip = ({ canvas, currentcolor }: TooltipProps) => {
    const [tooltip, setTooltip] = useState<HTMLDivElement | undefined>(undefined);
    const [colorSelection, setColorSelection] = useState<HTMLDivElement | undefined>(undefined);
    const [coords, setCoords] = useState<string | undefined>("x: 0 y: 0");

    const tooltipRef = useCallback((node: HTMLDivElement) => {
        if (node) {
            setTooltip(node);
        }
    }, []);

    const colorSelectionRef = useCallback((node: HTMLDivElement) => {
        if (node) {
            setColorSelection(node);
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
            setCoords("x: " + Math.floor(x / 2) + " y: " + Math.floor(y / 2));
            tooltip.style["transform"] = "translate(" + (x - tooltip.clientWidth / 2) + "px," + (y + tooltip.clientHeight + 10) + "px)";
        });

        return (() => {
            canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        })

    }, [canvas, tooltip]);



    return (
        <div className="coordinate-tooltip" ref={tooltipRef}>
            {coords}
            <div className="tooltip-color-outer">
                <span>
                    <div className="tooltip-color-selection" ref={colorSelectionRef}></div>
                </span>
            </div>
            <div>{"Placed By"}</div>
        </div>
    );
};

export default Tooltip;
