import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { BillPaymentData } from '../types';

export class BillPayPage extends BasePage {
	readonly billPayLink: Locator;
	readonly payeeNameInput: Locator;
	readonly addressInput: Locator;
	readonly cityInput: Locator;
	readonly stateInput: Locator;
	readonly zipCodeInput: Locator;
	readonly phoneInput: Locator;
	readonly accountInput: Locator;
	readonly verifyAccountInput: Locator;
	readonly amountInput: Locator;
	readonly fromAccountSelect: Locator;
	readonly sendPaymentButton: Locator;
	readonly successMessage: Locator;
	readonly successTitle: Locator;
	readonly paymentCompleteMessage: Locator;
	readonly errorMessage: Locator;
	readonly errorMisMatch: Locator;
	readonly payeeNameResult: Locator;
	readonly amountResult: Locator;
	readonly fromAccountIdResult: Locator;

	constructor(page: Page) {
		super(page);
		this.billPayLink = page.locator('a[href*="billpay"]');
		this.payeeNameInput = page.locator('input[name="payee.name"]');
		this.addressInput = page.locator('input[name="payee.address.street"]');
		this.cityInput = page.locator('input[name="payee.address.city"]');
		this.stateInput = page.locator('input[name="payee.address.state"]');
		this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
		this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
		this.accountInput = page.locator('input[name="payee.accountNumber"]');
		this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
		this.amountInput = page.locator('input[name="amount"]');
		this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
		this.sendPaymentButton = page.locator('input[value="Send Payment"]');
		this.successMessage = page.locator('text=Bill Payment Complete');
		this.successTitle = page.locator('#billpayResult h1');
		this.paymentCompleteMessage = page.locator('#billpayResult p');
		this.errorMessage = page.locator('.error');
		this.errorMisMatch = page.locator('#validationModel-verifyAccount-mismatch');
		this.payeeNameResult = page.locator('#payeeName');
		this.amountResult = page.locator('#amount');
		this.fromAccountIdResult = page.locator('#fromAccountId');
	}

	async navigateToBillPay() {
		await this.click(this.billPayLink);
	}

	async fillBillPaymentForm(paymentData: BillPaymentData) {
		await this.fill(this.payeeNameInput, paymentData.payeeName);
		await this.fill(this.addressInput, paymentData.address);
		await this.fill(this.cityInput, paymentData.city);
		await this.fill(this.stateInput, paymentData.state);
		await this.fill(this.zipCodeInput, paymentData.zipCode);
		await this.fill(this.phoneInput, paymentData.phone);
		await this.fill(this.accountInput, paymentData.account);
		await this.fill(this.verifyAccountInput, paymentData.verifyAccount);
		await this.fill(this.amountInput, paymentData.amount);
	}

	async sendPayment(paymentData: BillPaymentData) {
		await this.navigateToBillPay();
		await this.fillBillPaymentForm(paymentData);
		await this.click(this.sendPaymentButton);
	}

	async clickSendPayment() {
		await this.click(this.sendPaymentButton);
	}

	async isPaymentSuccessful(): Promise<boolean> {
		return await this.isVisible(this.successMessage);
	}

	async getSuccessTitle(): Promise<string> {
		return await this.getText(this.successTitle);
	}

	async getSuccessMessage(): Promise<string> {
		return await this.getText(this.paymentCompleteMessage);
	}

	async getErrorMessages(): Promise<string[]> {
		const errors = await this.errorMessage.all();
		const errorTexts: string[] = [];
		for (const error of errors) {
			const text = await error.textContent();
			if (text) errorTexts.push(text.trim());
		}
		return errorTexts;
	}

	async hasErrorMessage(): Promise<boolean> {
		return await this.isVisible(this.errorMessage);
	}

	async getErrorMismatch(): Promise<string> {
		return await this.getText(this.errorMisMatch);
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

	async getPaymentResultPayeeName(): Promise<string> {
		return await this.getText(this.payeeNameResult);
	}

	async getPaymentResultAmount(): Promise<string> {
		return await this.getText(this.amountResult);
	}

	async getPaymentResultFromAccountId(): Promise<string> {
		return await this.getText(this.fromAccountIdResult);
	}

	async getSelectedFromAccount(): Promise<string> {
		return await this.fromAccountSelect.inputValue();
	}
}
