const censorEmail = (email) => {
	const [localPart, domain] = email.split('@');
	return localPart[0] + '***' + localPart.slice(-1) + '@' + domain;
};

exports.censorEmail = censorEmail;

const censorPhone = (phone) => {
	return phone.toString().slice(0, 2) + '****' + phone.toString().slice(-2);
};
exports.censorPhone = censorPhone;

const formatToE164 = (phoneNumber) => {
    // Ensure the input is a string and contains exactly 10 digits
    if (typeof phoneNumber !== 'string' || !/^\d{10}$/.test(phoneNumber)) {
        throw new Error("Invalid phone number. Must be a 10-digit string.");
    }

    // Format to E.164
    return `+1${phoneNumber}`;
}

exports.formatToE164 = formatToE164;
