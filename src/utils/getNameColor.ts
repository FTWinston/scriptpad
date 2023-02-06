export function getNameColor(name: string) {    
	let hash = 0;
	let i;
  
	/* eslint-disable no-bitwise */
	for (i = 0; i < name.length; i += 1) {
	  hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	/* eslint-enable no-bitwise */

	const randomInt = (min: number, max: number) => {
		const val = Math.sin(hash++) * 10000;
		const clamped = val - Math.floor(val);
		
		return Math.round(clamped * (max - min) + min);
	}

	const hue = randomInt(0, 360);
	const saturation = randomInt(50, 100);
	const lightness = randomInt(30, 70);
	
	return `hsl(${hue}deg, ${saturation}%, ${lightness}%)`;
}
