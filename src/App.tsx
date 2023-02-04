import './css/Utils.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import useWeb3Modal from "./hooks/useWeb3Modal";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Place } from "./pages";
import { useAlert } from 'react-alert';

function App() {
	const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal({ NETWORK: "mumbai" });

	const [account, setAccount] = useState<string | undefined>(undefined);
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [ensName, /*setEnsName*/] = useState<string | null>(null);

	const [chain, setChain] = useState<number | undefined>(undefined);

	const alert = useAlert();
	// Subscribe to accounts change
	const handleAccountsChanged = async (accounts: string[]) => {
		setAccount(accounts[0]);
		// const web3provider = new Web3Provider(provider);
		//TODO: ENS NAME RESOLVING ON POLYGON?
		// const ensName = await web3provider.lookupAddress(accounts[0]);
		// setEnsName(ensName);
	};


	useEffect(() => {
		const handleChainChanged = (_chainId: string) => {
			alert.removeAll();
			// We recommend reloading the page, unless you must do otherwise
			if (parseInt(_chainId) === 137) {
				setChain(parseInt(_chainId));
				console.log(parseInt(_chainId));

				return;
			} else {
				alert.info("Please connect to Polygon");
				setChain(parseInt(_chainId));
				console.log(parseInt(_chainId));

				provider
					.request({ method: "wallet_switchEthereumChain", params: [{ chainId: '0x89' }] })
					.catch((error: any) => {
						if (error.code === 4902 || error.code === -32603) {
							provider
								.request({
									method: 'wallet_addEthereumChain',
									params: [
										{
											chainId: '0x89',
											rpcUrls: ['https://polygon-rpc.com/'],
											blockExplorerUrls: ["https://polygonscan.com/"],
											chainName: "Polygon Mainnet",
											nativeCurrency: {
												name: "MATIC",
												symbol: "MATIC", // 2-6 characters long
												decimals: 18
											}
										},
									],
								}).catch((err: any) => {
									console.log(error);
									if (error.code === 4001) {
										logoutOfWeb3Modal();
									}
								})
						} else if (error.code === 4001) {
							console.log(error);
							logoutOfWeb3Modal();
						}
					})
			}
		};

		if (provider !== undefined) {
			provider
				.request({ method: "eth_chainId" })
				.then(handleChainChanged)
				.catch((err: string) => {
					// Some unexpected error.
					// For backwards compatibility reasons, if no accounts are available,
					// eth_accounts will return an empty array.
					console.error(err);
				});
			provider
				.request({ method: "eth_accounts" })
				.then(handleAccountsChanged)
				.catch((err: string) => {
					// Some unexpected error.
					// For backwards compatibility reasons, if no accounts are available,
					// eth_accounts will return an empty array.
					console.error(err);
				});
			provider.on("chainChanged", handleChainChanged);
			provider.on("accountsChanged", handleAccountsChanged);
		}
	}, [provider, account, alert, logoutOfWeb3Modal]);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Place loadWeb3Modal={loadWeb3Modal} provider={provider} logoutOfWeb3Modal={logoutOfWeb3Modal} setLoggedIn={setLoggedIn} account={account} loggedIn={loggedIn} />} />
					<Route path='place' element={<Place loadWeb3Modal={loadWeb3Modal} provider={provider} logoutOfWeb3Modal={logoutOfWeb3Modal} setLoggedIn={setLoggedIn} account={account} loggedIn={loggedIn} />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
