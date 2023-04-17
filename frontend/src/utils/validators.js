export const validateRequired = (value) => !!value.length;

export const validateEmail = (email) =>
	!!email.length &&
	email
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);

export const renderElementForAdmin = (user, element) => {
	let render = null;
	if (user?.groups?.includes('ADMIN') ?? false) {
		render = element;
	}
	return render;
};

export const checkUserAdmin = (user) => {
	const userIsAdmin = user?.groups?.includes('ADMIN') ?? false;
	return userIsAdmin;
};
