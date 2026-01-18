interface APIPost {
	_id: string;
	caption: string;
	images: string[];
	author: APIUser;
	comments: APIComment[];
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

interface APIComment {
	text: string;
	author: APIUser;
}
