import "../css/Site.css";
import Navbar from "../components/site/Navbar";
import { Web3Props } from '../Utils'
import Footer from "../components/site/Footer";

const About = ({ account, ensName, provider, loadWeb3Modal }: Web3Props) => {

    return (
        <>
            <Navbar ensName={ensName} account={account} loadWeb3Modal={loadWeb3Modal} provider={provider} />
            <div className='site-section about-section'>
                <div className="site-paragraph">
                    <div className="site-text-container">
                        <h2 className="site-section-title mb-4">About</h2>
                        <h5 className="site-section-text">
                            A 250.000 pixels canvas which users can fill for a 0.005 {' '}
                            <a target='_blank' rel="noreferrer" href={"https://0xk.medium.com/the-what-the-why-and-the-how-of-0xbitcoin-5c635fe2df6b"}>
                                0xBTC
                            </a> per pixel fee.
                        </h5>
                        <h5 className="site-section-text">
                            Beware, anyone can paint over your pixels!
                        </h5>
                        <h5 className="site-section-text">
                            You can build your own frontend or timelapse by syncing the events emitted by the contract each time a user places pixels.
                        </h5>
                        <h5 className="site-section-text mt-4">
                            I take no responsability for the contents displayed on the canvas, but will attempt to moderate them if possible.
                        </h5>
                        <h5 className="site-section-text mt-5">
                            0xBitcoin Place is inspired by Moon Place and r/Place.
                        </h5>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default About;
