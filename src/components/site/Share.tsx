import { FaDiscord, FaFileContract, FaGithub, FaTwitter } from "react-icons/fa";

export default function Share() {
	return (
		<div className='share'>
			<div >
				<a
					href='https://discord.gg/qEbhU5T'
					target='_blank'
					rel='noopener noreferrer'>
					<FaDiscord />
				</a>
			</div>
			<div >
				<a
					href='https://twitter.com/0xBTCFoundation'
					target='_blank'
					rel='noopener noreferrer'>
					<FaTwitter />
				</a>
			</div>
			<div >
				<a
					href='https://polygonscan.com/address/0xf26da11a1f82ca18eca0c949944d7fc3ff9b8518'
					target='_blank'
					rel='noopener noreferrer'>
					<FaFileContract />
				</a>
			</div>
			<div >
				<a
					href='https://github.com/fappablo/0xbitcoin-space'
					target='_blank'
					rel='noopener noreferrer'>
					<FaGithub />
				</a>
			</div>
		</div>
	);
}
