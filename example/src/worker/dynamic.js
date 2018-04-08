export async function dynamicImport(id) {
	return await (await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)).json();
}