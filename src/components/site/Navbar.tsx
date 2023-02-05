import { useState } from "react";
import { Link } from "react-router-dom";
import { Web3Props } from "../../Utils";

const Navbar = ({ account, ensName, loadWeb3Modal, provider }: Web3Props) => {

	const [bg, setBg] = useState(false);
	const changeColor = () => {
		if (window.scrollY >= window.innerHeight/2)
			setBg(true)
		else
			setBg(false)
	}

	window.addEventListener('scroll', changeColor)

	return (
		<div className={bg ? 'navbar navbar-bg' : "navbar"}>
			<Link className="logo-container" to={"/home"}>
				<img className='logo' src='.\android-chrome-192x192.png' />
			</Link>
			<div className='navbar-menu'>
				{/* <Link className='nav-button' to={"/creation"}>Dwarf Creation</Link> */}
				<Link className='nav-button' to={"/place"}>Place</Link>
				{provider ?
					<span className="nav-button" style={{ cursor: 'default' }} >{ensName ? ensName : account ? account.substring(0, 10) : ""}</span> :
					<div className='nav-button' style={{ cursor: 'pointer' }} onClick={loadWeb3Modal}>Connect</div>
				}
				{/* <div className='nav-button'>Home</div>
        		<div className='nav-button'>Home</div> */}
			</div>
		</div >
	);
};

export default Navbar;
