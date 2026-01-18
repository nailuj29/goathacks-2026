export interface APIPost {
	_id: string;
	caption: string;
	images: string[];
	author: APIUser;
	comments: APIComment[];
}

export interface APIUploadPost {
	caption: string;
	images: string[];
}

export interface APIUser {
	_id: string;
	username: string;
	name: string;
}

export interface APIComment {
	text: string;
	author: APIUser;
}
