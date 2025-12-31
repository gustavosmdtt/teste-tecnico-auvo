export interface UserRegistrationData {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	phone: string;
	ssn: string;
	username: string;
	password: string;
	confirmPassword: string;
}

export interface UserPersonalData {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	ssn: string;
}

export interface BillPaymentData {
	payeeName: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	phone: string;
	account: string
	verifyAccount: string
	amount: string;
}

export interface UserCredentials {
	username: string;
	password: string;
}

export interface TestUser extends UserCredentials {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	ssn: string;
}

export interface AccuntsIdsArrayData {
	id: number
	customerId: number
	type: string
	balance: number
}

