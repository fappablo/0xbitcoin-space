import { FaDiscord, FaTwitter } from "react-icons/fa";

export default function Share() {
	return (
		<div className='share'>
			<div className='discord'>
				<a
					href='https://discord.gg/qEbhU5T'
					target='_blank'
					rel='noopener noreferrer'>
					<FaDiscord />
				</a>
			</div>
			<div className='twitter'>
				<a
					href='https://twitter.com/0xBTCFoundation'
					target='_blank'
					rel='noopener noreferrer'>
					<FaTwitter />
				</a>    
			</div>
		</div>
	);
}
