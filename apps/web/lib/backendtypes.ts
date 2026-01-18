interface APIPost {
	caption: string;
	images: string[];
	author: APIUser;
}

interface APIUploadPost {
	caption: string;
	images: string[];
}

interface APIUser {
	_id: string;
	username: string;
	name: string;
}
