import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { UserPersonalData } from '../types';

export class ForgetLoginPage extends BasePage {
	readonly forgetLoginLink: Locator;
	readonly firstNameInput: Locator;
	readonly lastNameInput: Locator;
	readonly addressInput: Locator;
	readonly cityInput: Locator;
	readonly stateInput: Locator;
	readonly zipCodeInput: Locator;
	readonly ssnInput: Locator;
	readonly findLoginButton: Locator;
	readonly usernameResult: Locator;
	readonly passwordResult: Locator;
	readonly successTitle: Locator;
	readonly errorMessage: Locator;

	constructor(page: Page) {
		super(page);
		this.forgetLoginLink = page.locator('a[href*="lookup"]');
		this.firstNameInput = page.locator('input[id="firstName"]');
		this.lastNameInput = page.locator('input[id="lastName"]');
		this.addressInput = page.locator('input[id="address.street"]');
		this.cityInput = page.locator('input[id="address.city"]');
		this.stateInput = page.locator('input[id="address.state"]');
		this.zipCodeInput = page.locator('input[id="address.zipCode"]');
		this.ssnInput = page.locator('input[id="ssn"]');
		this.findLoginButton = page.locator('input[value="Find My Login Info"]');
		this.usernameResult = page.locator('#rightPanel p b:has-text("Username:")').locator('..').locator('text=/\\w+/');
		this.passwordResult = page.locator('#rightPanel p b:has-text("Password:")').locator('..').locator('text=/\\w+/');
		this.successTitle = page.locator('#rightPanel h1');
		this.errorMessage = page.locator('.error');
	}

	async navigateToForgetLogin() {
		await this.goto();
		await this.click(this.forgetLoginLink);
	}

	async fillForgetLoginForm(userData: UserPersonalData) {
		await this.fill(this.firstNameInput, userData.firstName);
		await this.fill(this.lastNameInput, userData.lastName);
		await this.fill(this.addressInput, userData.address);
		await this.fill(this.cityInput, userData.city);
		await this.fill(this.stateInput, userData.state);
		await this.fill(this.zipCodeInput, userData.zipCode);
		await this.fill(this.ssnInput, userData.ssn);
	}

	async clickFindLogin() {
		await this.click(this.findLoginButton);
	}

	async findLogin(userData: UserPersonalData) {
		await this.navigateToForgetLogin();
		await this.fillForgetLoginForm(userData);
		await this.clickFindLogin();
	}

	async getUsername(): Promise<string> {
		return await this.getText(this.usernameResult);
	}

	async getPassword(): Promise<string> {
		return await this.getText(this.passwordResult);
	}

	async getSuccessTitle(): Promise<string> {
		return await this.getText(this.successTitle);
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
}
