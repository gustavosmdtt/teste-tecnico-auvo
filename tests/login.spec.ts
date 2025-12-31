import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../fixtures/testData';

test.describe('Login no Sistema', () => {
	let loginPage: LoginPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
	});

	test('Should login successfully with valid credentials', async () => {
		await loginPage.login(testData.testUser.username, testData.testUser.password);

		await expect(loginPage.page).toHaveURL(/overview/);
		await expect(loginPage.welcomeMessage).toBeVisible();

		const welcomeText = await loginPage.getWelcomeMessage();
		expect(welcomeText).toContain('Welcome');

		await expect(loginPage.logoutLink).toBeVisible();
	});

	test('Should show error with incorrect password', async () => {
		await loginPage.login(testData.testUser.username, 'UmaSenhaAleatoriaQueNiguemColocaria');

		const hasError = await loginPage.hasErrorMessage();
		expect(hasError).toBeTruthy();

		const errorMessage = await loginPage.getErrorMessage();
		expect(errorMessage).toContain('error');
	});

	test('Should show error with non-existent user', async () => {
		await loginPage.login('EsteUsuarioNaoDeveriaExistir', testData.testUser.password);

		await expect(loginPage.errorMessage).toBeVisible();

		const errorMessage = await loginPage.getErrorMessage();
		expect(errorMessage).toContain('error');
	});

	test('Should show error when fields are empty', async () => {
		await loginPage.login('', '');

		await expect(loginPage.errorMessage).toBeVisible();

		const errorMessage = await loginPage.getErrorMessage();
		expect(errorMessage).toContain('Please enter a username and password');
	});
});
