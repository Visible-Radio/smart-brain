import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
	
	if (box.rightX) {
		return (
			<div id='imgWrapper'>
				<img id='inputimage' alt='' src={imageUrl} />						
					<div id='outlineBox'
						style={
							{										
								width: box.rightX - box.leftX + 'px',
								height: box.bottomY - box.topY + 'px',
								top: box.topY + 'px',
								left: box.leftX,
							}
						}
					/>									
		 	</div>		 	
		);

	} else {		
		return (
			<div id='imgWrapper'>
				<img id='inputimage' alt='' src={imageUrl} />																				
		 	</div>
		);
	}
}

export default FaceRecognition;