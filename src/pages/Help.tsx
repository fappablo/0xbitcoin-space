import "../css/Site.css";
import Navbar from "../components/site/Navbar";
import { Web3Props } from '../Utils'
import Footer from "../components/site/Footer";
import { FaEraser, FaMinusCircle, FaPencilAlt, FaPlusCircle } from "react-icons/fa";

const Help = ({ account, ensName, provider, loadWeb3Modal }: Web3Props) => {

    return (
        <>
            <Navbar ensName={ensName} account={account} loadWeb3Modal={loadWeb3Modal} provider={provider} />
            <div className='site-section about-section'>
                <div className="site-paragraph">
                    <div className="site-text-container">
                        <h2 className="site-section-title mb-4">How do I use this?</h2>
                        <h5 className="site-section-text">
                            This Dapp is deployed on the Polygon network, you should get prompted to connect to Polygon by your wallet
                            if you are not.
                        </h5>
                        <h5 className="site-section-text">
                            In order to place pixels on the canvas you'll need some MATIC (for the gas fee) and 0.005 {' '}
                            <a target='_blank' rel="noreferrer" href={"https://0xk.medium.com/the-what-the-why-and-the-how-of-0xbitcoin-5c635fe2df6b"}>
                                0xBTC
                            </a> per pixel. Buy 0xBTC on <a target='_blank' rel="noreferrer" href={"https://app.uniswap.org/#/swap"}>
                                Uniswap
                            </a>
                        </h5>
                        <h5 className="site-section-text">

                        </h5>
                        <h5 className="site-section-text">
                            Use the color picker tool on the left to select a color, <FaPlusCircle /> and <FaMinusCircle /> {' '}
                            to zoom, <FaPencilAlt /> and <FaEraser /> to draw or erase and the shopping cart on the right
                            to review your order.
                        </h5>
                        <h5 className="site-section-text">
                            Scroll using the middle mouse button, the mouse wheel or by clicking on the scroll bars.
                        </h5>
                        <h5 className="site-section-text">
                            Once you have drawn your pixels click on the Approve button in the shopping cart. Confirm the transaction and wait for it to be processed by the network.
                        </h5>
                        <h5 className="site-section-text">
                            You can now click on the buy button to place your pixels! (You'll need to confirm a new transaction
                            for each batch of pixels)
                        </h5>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Help;
