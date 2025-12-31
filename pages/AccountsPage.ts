import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { api_waitForAccountsLoad, api_waitForCreateAccount, api_getCustomerIdFromNetwork } from '../fixtures/accountsInterceptor';

export class AccountsPage extends BasePage {
	readonly openNewAccountLink: Locator;
	readonly accountTypeSelect: Locator;
	readonly fromAccountSelect: Locator;
	readonly openAccountButton: Locator;
	readonly successMessage: Locator;
	readonly successTitle: Locator;
	readonly accountOpenedMessage: Locator;
	readonly newAccountId: Locator;
	readonly accountsOverviewLink: Locator;
	readonly accountsTable: Locator;
	readonly accountLinks: Locator;
	readonly errorMessage: Locator;

	constructor(page: Page) {
		super(page);
		this.openNewAccountLink = page.locator('a[href*="openaccount"]');
		this.accountTypeSelect = page.locator('#type');
		this.fromAccountSelect = page.locator('#fromAccountId');
		this.openAccountButton = page.locator('input[value="Open New Account"]');
		this.successMessage = page.locator('text=Congratulations');
		this.successTitle = page.locator('#openAccountResult h1');
		this.accountOpenedMessage = page.locator('#openAccountResult');
		this.newAccountId = page.locator('#newAccountId');
		this.accountsOverviewLink = page.locator('a[href*="overview"]');
		this.accountsTable = page.locator('#accountTable');
		this.accountLinks = page.locator('a[href*="activity.htm?id="]');
		this.errorMessage = page.locator('.error');
	}

	async navigateToOpenAccount() {
		await this.click(this.openNewAccountLink);
	}

	async openNewAccount(accountType: 'SAVINGS' | 'CHECKING') {
		await this.navigateToOpenAccount();
		await api_waitForAccountsLoad(this.page);
		await this.accountTypeSelect.selectOption(accountType);
		await this.click(this.openAccountButton);
		await api_waitForCreateAccount(this.page);
	}

	async isAccountCreated(): Promise<boolean> {
		return await this.isVisible(this.successMessage);
	}

	async getSuccessTitle(): Promise<string> {
		return await this.getText(this.successTitle);
	}

	async getSuccessMessage(): Promise<string> {
		return await this.getText(this.accountOpenedMessage);
	}

	async getNewAccountId(): Promise<string> {
		return await this.getText(this.newAccountId);
	}

	async getErrorMessage(): Promise<string> {
		return await this.getText(this.errorMessage);
	}

	async navigateToAccountsOverview() {
		await this.click(this.accountsOverviewLink);
	}

	async api_getAccountIds(): Promise<number[]> {
		await this.navigateToAccountsOverview();

		const customerId = await api_getCustomerIdFromNetwork(this.page);

		const cookies = await this.page.context().cookies();
		const sessionCookie = cookies.find(cookies => cookies.name === 'JSESSIONID');

		const accountsResponse = await this.page.request.get(
			`/parabank/services/bank/customers/${customerId}/accounts`,
			{
				headers: {
					'Cookie': `JSESSIONID=${sessionCookie?.value}`
				}
			}
		);

		const accounts = await accountsResponse.json();
		return accounts.map((account: any) => account.id);
	}

	async hasAccounts(): Promise<boolean> {
		const ids = await this.api_getAccountIds();
		return ids.length > 0;
	}
}
