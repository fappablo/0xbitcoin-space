
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export interface Web3Props {
    loadWeb3Modal?: any;
    logoutOfWeb3Modal?: any;
    provider?: any;
    setLoggedIn?: any;
    loggedIn?: boolean;
    account?: string;
    ensName?: string | null
    dwarfID?: number;
    chain?: number;
}


export interface TooltipProps {
    canvas: HTMLCanvasElement | null;
    currentcolor: string;
}

export interface ShoppingCartProps {
    provider?: any;
    pixels?: [number, number, string][]
    removePixel: (i: number) => void;
}