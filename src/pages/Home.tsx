import "../css/Site.css";
import Navbar from "../components/site/Navbar";
import { Web3Props } from '../Utils'
import Footer from "../components/site/Footer";

const Home = ({ account, ensName, provider, loadWeb3Modal }: Web3Props) => {

  return (
    <>
      <Navbar ensName={ensName} account={account} loadWeb3Modal={loadWeb3Modal} provider={provider} />

      <div className='site-section' >
        <div className="site-paragraph" >
          <div className="site-text-container" >
            <h2 className="site-section-title">What is <span className="site-accent">Dwarven Relics</span> about?</h2>
            <h5 className="site-section-text justify">
              Dwarven Relics is a <span className="site-accent"> top-down browser-based MMORPG</span> where players must cooperate to
              fight back the foul creatures which have overrun the dwarven fortress of Dûnnbarg
            </h5>
            <h6 className="site-section-text justify">
              Dive into the depths of the fortress to scavenge the resources left by your folk's retreat
              and forge new equipment while searching for powerful relics lost in ancient times.
            </h6>
          </div>
          <div className="site-img-container">
            <img className="site-section-img pixel-art" src="entrance.gif" alt="dwarven door" width={320} />
          </div>
        </div>
      </div>
      <div className='site-section' >
        <div className="site-paragraph reverse">
          <div className="site-text-container">
            <h2 className="site-section-title">Hold your <span className="site-accent">Relics</span></h2>
            <h5 className="site-section-text justify">
              Keep real ownership of everything found in the fortress:
              from the Dwarf you play to the most legendary items found under piles of goblin bones.
            </h5>
            <h6 className="site-section-text justify">
              Our game is built on the <span className="site-accent">Polygon carbon neutral blockchain </span>
              which enables you to trade and safekeep your assets without involving us or any other third party.
            </h6>
          </div>
          <div className="site-img-container">
            <img className="site-section-img pixel-art" src="forgegoddess.png" alt="forge goddess statue" width={160} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
