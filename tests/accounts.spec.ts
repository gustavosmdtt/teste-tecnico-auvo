import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsPage } from '../pages/AccountsPage';
import { testData } from '../fixtures/testData';
import { api_waitForAccountsLoad } from '../fixtures/accountsInterceptor';

test.describe('Abertura de Conta e Visualização', () => {
	let loginPage: LoginPage;
	let accountsPage: AccountsPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		accountsPage = new AccountsPage(page);

		await loginPage.login(testData.testUser.username, testData.testUser.password);
	});

	test('Should open a Savings account successfully', async () => {
		await accountsPage.openNewAccount('SAVINGS');

		const successTitle = await accountsPage.getSuccessTitle();
		expect(successTitle).toBe('Account Opened!');

		const successMessage = await accountsPage.getSuccessMessage();
		expect(successMessage).toContain('Congratulations, your account is now open.');

		const accountId = await accountsPage.getNewAccountId();
		expect(accountId).toBeTruthy();
		expect(parseInt(accountId)).toBeGreaterThan(0);
	});

	test('Should open a Checking account successfully', async () => {
		await accountsPage.openNewAccount('CHECKING');

		const successTitle = await accountsPage.getSuccessTitle();
		expect(successTitle).toBe('Account Opened!');

		const successMessage = await accountsPage.getSuccessMessage();
		expect(successMessage).toContain('Congratulations, your account is now open.');

		const accountId = await accountsPage.getNewAccountId();
		expect(accountId).toBeTruthy();
		expect(parseInt(accountId)).toBeGreaterThan(0);
	});

	test('Should display all user accounts in overview', async () => {
		await accountsPage.navigateToAccountsOverview();
		await api_waitForAccountsLoad(accountsPage.page);
		await expect(accountsPage.accountsTable).toBeVisible();

		const hasAccounts = await accountsPage.hasAccounts();
		expect(hasAccounts).toBeTruthy();

		const accountIds = await accountsPage.api_getAccountIds();
		expect(accountIds.length).toBeGreaterThan(0);

		accountIds.forEach((id: number) => {
			expect(id).toBeGreaterThan(0);
		});
	});
});
