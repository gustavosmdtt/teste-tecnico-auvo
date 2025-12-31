import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class TransferFundsPage extends BasePage {
	readonly transferFundsLink: Locator;
	readonly amountInput: Locator;
	readonly fromAccountSelect: Locator;
	readonly toAccountSelect: Locator;
	readonly transferButton: Locator;
	readonly successMessage: Locator;
	readonly successTitle: Locator;
	readonly transferCompleteMessage: Locator;
	readonly errorMessageTitle: Locator;
	readonly errorMessageBody: Locator;
	readonly amountResult: Locator;
	readonly fromAccountIdResult: Locator;
	readonly toAccountIdResult: Locator;

	constructor(page: Page) {
		super(page);
		this.transferFundsLink = page.locator('a[href*="transfer"]');
		this.amountInput = page.locator('#amount');
		this.fromAccountSelect = page.locator('#fromAccountId');
		this.toAccountSelect = page.locator('#toAccountId');
		this.transferButton = page.locator('input[value="Transfer"]');
		this.successMessage = page.locator('text=Transfer Complete');
		this.successTitle = page.locator('#showResult .title');
		this.transferCompleteMessage = page.locator('#showResult p');
		this.errorMessageTitle = page.locator('#showError .title');
		this.errorMessageBody = page.locator('#showError .error');
		this.amountResult = page.locator('#amountResult');
		this.fromAccountIdResult = page.locator('#fromAccountIdResult');
		this.toAccountIdResult = page.locator('#toAccountIdResult');
	}

	async navigateToTransfer() {
		await this.click(this.transferFundsLink);
	}

	async transfer(amount: string, fromAccount?: string, toAccount?: string) {
		await this.navigateToTransfer();

		if (amount) {
			await this.fill(this.amountInput, amount);
		}

		if (fromAccount) {
			await this.fromAccountSelect.selectOption(fromAccount);
		}

		if (toAccount) {
			await this.toAccountSelect.selectOption(toAccount);
		}

		await this.click(this.transferButton);
	}

	async getSelectedFromAccount(): Promise<string> {
		return await this.fromAccountSelect.inputValue();
	}

	async getSelectedToAccount(): Promise<string> {
		return await this.toAccountSelect.inputValue();
	}

	async isTransferSuccessful(): Promise<boolean> {
		return await this.isVisible(this.successMessage);
	}

	async getSuccessTitle(): Promise<string> {
		return await this.getText(this.successTitle);
	}

	async getSuccessMessage(): Promise<string> {
		return await this.getText(this.transferCompleteMessage);
	}

	async hasErrorMessage(): Promise<boolean> {
		return await this.isVisible(this.errorMessageTitle);
	}

	async getErrorMessageTitle(): Promise<string> {
		return await this.getText(this.errorMessageTitle);
	}

	async getErrorMessageBody(): Promise<string> {
		const text = await this.getText(this.errorMessageBody);
		return text.trim();
	}

	async getAvailableAccounts(): Promise<string[]> {
		const options = await this.fromAccountSelect.locator('option').all();
		const accounts: string[] = [];

		for (const option of options) {
			const value = await option.getAttribute('value');
			if (value) accounts.push(value);
		}
		return accounts;
	}

	async getTransferResultAmount(): Promise<string> {
		return await this.getText(this.amountResult);
	}

	async getTransferResultFromAccount(): Promise<string> {
		return await this.getText(this.fromAccountIdResult);
	}

	async getTransferResultToAccount(): Promise<string> {
		return await this.getText(this.toAccountIdResult);
	}
}
