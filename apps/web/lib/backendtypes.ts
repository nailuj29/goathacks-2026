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
	username: string;
	name: string;
}
