import { TestUser, UserRegistrationData } from '../types';

export const testData = {
	validUser: {
		firstName: 'João',
		lastName: 'Silva',
		address: 'Rua Teste, 123',
		city: 'Porto Alegre',
		state: 'RS',
		zipCode: '90000-000',
		phone: '(51) 99999-9999',
		ssn: '123-45-6789',
		password: 'Teste@123',
	},

	testUser: {
		username: 'john',
		password: 'demo',
		firstName: 'John',
		lastName: 'Smith',
		address: '1431 Main St',
		city: 'Beverly Hills',
		state: 'CA',
		zipCode: '90210',
		ssn: '123-45-6789',
	} as TestUser,
};

export const generateUser = (): UserRegistrationData => {
	const timestamp = Date.now();
	return {
		...testData.validUser,
		username: `user_${timestamp}`,
		confirmPassword: testData.validUser.password,
	};
};
