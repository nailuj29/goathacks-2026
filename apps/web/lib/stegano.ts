function toUint16BE(number: number) {
	return new Uint8Array([
		(number >> 8) & 0xff, // high byte
		number & 0xff, // low byte
	]);
}

function fromUint16BE(bytes: Uint8Array) {
	return (bytes[0] << 8) | bytes[1];
}

interface PayloadFile {
	name: string;
	type: string;
	bytes: Uint8Array;
}

interface PayloadData {
	files: PayloadFile[];
}

const SALT = new Uint8Array([
	0x48, 0x61, 0x63, 0x6b, 0x61, 0x74, 0x68, 0x6f, 0x6e, 0x32, 0x30, 0x32, 0x36,
	0x21, 0x21, 0x21,
]);

async function deriveKeyFromPassword(password: string): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	const passwordKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveKey'],
	);

	return await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: SALT,
			iterations: 100000,
			hash: 'SHA-256',
		},
		passwordKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt'],
	);
}

async function createPayload(
	attachments: File[],
	key: string,
): Promise<Uint8Array> {
	const payloadData: PayloadData = { files: [] };

	for (const file of attachments) {
		const fileBytes = await file.bytes();
		payloadData.files.push({
			name: file.name,
			type: file.type,
			bytes: fileBytes,
		});
	}

	const payloadStr = JSON.stringify(payloadData);
	const iv = crypto.getRandomValues(new Uint8Array(12));

	const cryptoKey = await deriveKeyFromPassword(key);

	const encoder = new TextEncoder();
	const encrypted = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv,
		},
		cryptoKey,
		encoder.encode(payloadStr),
	);

	// Combine iv + encrypted data
	const result = new Uint8Array(iv.length + encrypted.byteLength);
	result.set(iv, 0);
	result.set(new Uint8Array(encrypted), iv.length);

	return result;
}

async function decryptPayload(
	data: Uint8Array,
	key: string,
): Promise<PayloadData | null> {
	const iv = data.slice(0, 12);
	const encryptedData = data.slice(12);

	const cryptoKey = await deriveKeyFromPassword(key);

	try {
		const decrypted = await crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv,
			},
			cryptoKey,
			encryptedData,
		);

		const decoder = new TextDecoder();
		const decryptedStr = decoder.decode(decrypted);
		return JSON.parse(decryptedStr) as PayloadData;
	} catch (e) {
		console.error('Decryption failed', e);
		return null;
	}
}

async function encodeImage(image: File, data: Uint8Array) {
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

async function decodeImage(image: Blob): Promise<Uint8Array | undefined> {
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

export async function createStegImage(
	image: File,
	attachments: File[],
	key: string,
) {
	const payload = await createPayload(attachments, key);
	return await encodeImage(image, payload);
}

export async function decryptStegImage(
	image: Blob,
	key: string,
): Promise<File[] | null> {
	const decoded = await decodeImage(image);
	if (!decoded) return null;
	const decrypted = await decryptPayload(decoded, key);
	if (!decrypted) return null;

	const files: File[] = [];

	for (const file of decrypted.files) {
		files.push(
			new File([new Uint8Array(file.bytes)], file.name, { type: file.type }),
		);
	}

	return files;
}
