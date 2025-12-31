import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { generateUser } from '../fixtures/testData';

test.describe('Cadastro de Usuário', () => {
	let registerPage: RegisterPage;

	test.beforeEach(async ({ page }) => {
		registerPage = new RegisterPage(page);
	});

	test('Should register a new user successfully', async () => {
		const userData = generateUser();

		await registerPage.register(userData);

		await expect(registerPage.successMessage).toBeVisible();

		const successMessage = await registerPage.getSuccessMessage();
		expect(successMessage).toContain('Your account was created successfully');

		const welcomeMessage = await registerPage.getWelcomeMessage();
		expect(welcomeMessage).toContain('Welcome');
		expect(welcomeMessage).toContain(userData.username);
	});

	test('Should show errors when required fields are empty', async () => {
		await registerPage.navigateToRegister();
		await registerPage.clickRegister();

		await expect(registerPage.errorMessages.first()).toBeVisible();

		const errors = await registerPage.getErrorMessages();
		expect(errors.length).toBeGreaterThan(0);
		errors.forEach(error => {
			expect(error).toContain('is required');
		});
	});

	test('Should show error when passwords do not match', async () => {
		const userData = generateUser();
		userData.confirmPassword = 'SenhaDiferente456';

		await registerPage.register(userData);

		await expect(registerPage.errorMessages.first()).toBeVisible();

		const errors = await registerPage.getErrorMessages();
		const hasPasswordError = errors.some(error =>
			error.toLowerCase().includes('password') ||
			error.toLowerCase().includes('match')
		);
		expect(hasPasswordError).toBeTruthy();
	});

	test('Should show error when username already exists', async () => {
		const userData = generateUser();
		userData.username = 'john';

		await registerPage.register(userData);

		await expect(registerPage.errorMessages).toContainText('This username already exists.');
	});

	test('Should show error when zip code is invalid', async () => {
		const userData = generateUser();
		userData.zipCode = 'ABCDE';

		await registerPage.register(userData);

		await expect(registerPage.errorMessages.first()).toBeVisible();

		const errors = await registerPage.getErrorMessages();
		expect(errors.length).toBeGreaterThan(0);
	});

	test('Should show error when SSN is invalid', async () => {
		const userData = generateUser();
		userData.ssn = 'INVALID-SSN';

		await registerPage.register(userData);

		await expect(registerPage.errorMessages.first()).toBeVisible();

		const errors = await registerPage.getErrorMessages();
		expect(errors.length).toBeGreaterThan(0);
	});
});
