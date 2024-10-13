const censorEmail = (email) => {
	const [localPart, domain] = email.split('@');
	return localPart[0] + '***' + localPart.slice(-1) + '@' + domain;
};
exports.censorEmail = censorEmail;

const censorPhone = (phone) => {
	return phone.toString().slice(0, 2) + '****' + phone.toString().slice(-2);
};
exports.censorPhone = censorPhone;

