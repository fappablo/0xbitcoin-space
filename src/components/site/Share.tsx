import { FaDiscord, FaTwitter } from "react-icons/fa";

export default function Share() {
	return (
		<div className='share'>
			{/* <div className='discord'>
				<a
					href=''
					target='_blank'
					rel='noopener noreferrer'>
					<FaDiscord />
				</a>
			</div> */}
			<div className='twitter'>
				<a
					href='https://twitter.com/DwarvenRelics'
					target='_blank'
					rel='noopener noreferrer'>
					<FaTwitter />
				</a>    
			</div>
		</div>
	);
}
