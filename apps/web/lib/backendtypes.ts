interface APIPost {
	caption: string;
	images: string[];
	author: APIUser;
}

interface APIUser {
	username: string;
	name: string;
}
