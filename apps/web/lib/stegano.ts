function toUint16BE(number: number) {
	return new Uint8Array([
		(number >> 8) & 0xff, // high byte
		number & 0xff, // low byte
	]);
}

function fromUint16BE(bytes: Uint8Array) {
	return (bytes[0] << 8) | bytes[1];
}

export async function encodeImage(image: File, data: Uint8Array) {
	const imageData: Uint8Array = await image.bytes();

	// Uses APP3 marker
	const appSegmentHeader = new Uint8Array([0xff, 0xe3]);
	const appSegmentLength = data.length + 2; // length includes the 2 length bytes
	const appSegmentLengthBytes = toUint16BE(appSegmentLength);

	let startScanLocation = -1;
	for (let i = 0; i < imageData.length - 1; i++) {
		if (imageData[i] === 0xff && imageData[i + 1] === 0xda) {
			startScanLocation = i;
			break;
		}
	}

	if (startScanLocation === -1) {
		console.error('Could not find start of scan in image');
		return;
	}

	const leftImageData = imageData.slice(0, startScanLocation);
	const rightImageData = imageData.slice(startScanLocation);

	// Allocate: left + marker + payload length + payload + right
	const newImageData = new Uint8Array(
		leftImageData.length + 2 + appSegmentLength + rightImageData.length,
	);

	// Place app segment in the new image data before the first scan marker
	newImageData.set(leftImageData, 0);
	newImageData.set(appSegmentHeader, leftImageData.length);
	newImageData.set(appSegmentLengthBytes, leftImageData.length + 2);
	newImageData.set(data, leftImageData.length + 4);
	newImageData.set(rightImageData, leftImageData.length + 2 + appSegmentLength);

	return new Blob([newImageData], { type: image.type });
}

export async function decodeImage(
	image: Blob,
): Promise<Uint8Array | undefined> {
	const imageData = await image.bytes();

	let startSegmentLocation = -1;
	for (let i = 0; i < imageData.length - 1; i++) {
		if (imageData[i] === 0xff && imageData[i + 1] === 0xe3) {
			startSegmentLocation = i;
			break;
		}
	}

	if (startSegmentLocation === -1) {
		console.error('No stegano segment found');
		return;
	}

	// Decode next two bytes as length
	const lengthBytes = imageData.slice(
		startSegmentLocation + 2,
		startSegmentLocation + 4,
	);
	const segmentLength = fromUint16BE(lengthBytes);

	const segmentData = imageData.slice(
		startSegmentLocation + 4,
		startSegmentLocation + 4 + (segmentLength - 2),
	);

	return segmentData;
}
