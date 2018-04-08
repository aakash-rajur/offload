import initialize from 'offload/dist/initialize';

export async function getPhotos() {
	return await (await fetch('https://jsonplaceholder.typicode.com/photos')).json()
}

export async function getUsers() {
	return await (await fetch('https://jsonplaceholder.typicode.com/users')).json()
}

export async function getPostsofUser(userID) {
	return await (await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userID}`)).json();
}

export async function getCommentofPost(postID) {
	return await (await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postID}`)).json();
}

export async function getPost(id) {
	let {dynamicImport} = await import('./dynamic');
	return await dynamicImport(id);
}

initialize(this);