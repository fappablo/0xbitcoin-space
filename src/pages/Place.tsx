import "../css/Site.css";
import Navbar from "../components/site/Navbar";
import { Web3Props } from '../Utils'
import Footer from "../components/site/Footer";
import Canvas from "../components/site/Canvas";

const Place = ({ account, ensName, provider, loadWeb3Modal }: Web3Props) => {

    return (
        <>
            <Navbar ensName={ensName} account={account} loadWeb3Modal={loadWeb3Modal} provider={provider} />

            <div className='site-section' >
                <Canvas />
            </div>

            <Footer />
        </>
    );
};

export default Place;
