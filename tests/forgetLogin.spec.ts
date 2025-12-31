import { test, expect } from '@playwright/test';
import { ForgetLoginPage } from '../pages/ForgetLoginPage';
import { testData } from '../fixtures/testData';

test.describe('Recuperação de Login', () => {
	let forgetLoginPage: ForgetLoginPage;

	test.beforeEach(async ({ page }) => {
		forgetLoginPage = new ForgetLoginPage(page);
	});

	test('Should display username and password successfully', async () => {
		const userData = {
			firstName: testData.testUser.firstName,
			lastName: testData.testUser.lastName,
			address: testData.testUser.address,
			city: testData.testUser.city,
			state: testData.testUser.state,
			zipCode: testData.testUser.zipCode,
			ssn: testData.testUser.ssn
		};

		await forgetLoginPage.findLogin(userData);

		const successTitle = await forgetLoginPage.getSuccessTitle();
		expect(successTitle).toContain('Customer Lookup');

		const username = await forgetLoginPage.getUsername();
		expect(username).toBeTruthy();
		expect(username).toBe(testData.testUser.username);

		const password = await forgetLoginPage.getPassword();
		expect(password).toBeTruthy();
	});

	test('Should show errors when required fields are empty', async () => {
		await forgetLoginPage.navigateToForgetLogin();
		await forgetLoginPage.clickFindLogin();

		await expect(forgetLoginPage.errorMessage.first()).toBeVisible();

		const errors = await forgetLoginPage.getErrorMessages();
		expect(errors.length).toBeGreaterThan(0);
	});

	test('Should show error when form data is invalid', async () => {
		const invalidData = {
			firstName: 'InvalidFirstName',
			lastName: 'InvalidLastName',
			address: 'Invalid Address 999',
			city: 'Invalid City',
			state: 'XX',
			zipCode: '99999',
			ssn: '999-99-9999'
		};

		await forgetLoginPage.findLogin(invalidData);

		await expect(forgetLoginPage.errorMessage).toBeVisible();

		const errors = await forgetLoginPage.getErrorMessages();
		expect(errors.length).toBeGreaterThan(0);
	});
});
