import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { UserRegistrationData } from '../types';

export class RegisterPage extends BasePage {
	readonly registerLink: Locator;
	readonly firstNameInput: Locator;
	readonly lastNameInput: Locator;
	readonly addressInput: Locator;
	readonly cityInput: Locator;
	readonly stateInput: Locator;
	readonly zipCodeInput: Locator;
	readonly phoneInput: Locator;
	readonly ssnInput: Locator;
	readonly usernameInput: Locator;
	readonly passwordInput: Locator;
	readonly confirmPasswordInput: Locator;
	readonly registerButton: Locator;
	readonly successMessage: Locator;
	readonly errorMessages: Locator;
	readonly welcomeMessage: Locator;

	constructor(page: Page) {
		super(page);
		this.registerLink = page.locator('a[href*="register"]');
		this.firstNameInput = page.locator('input[id="customer.firstName"]');
		this.lastNameInput = page.locator('input[id="customer.lastName"]');
		this.addressInput = page.locator('input[id="customer.address.street"]');
		this.cityInput = page.locator('input[id="customer.address.city"]');
		this.stateInput = page.locator('input[id="customer.address.state"]');
		this.zipCodeInput = page.locator('input[id="customer.address.zipCode"]');
		this.phoneInput = page.locator('input[id="customer.phoneNumber"]');
		this.ssnInput = page.locator('input[id="customer.ssn"]');
		this.usernameInput = page.locator('input[id="customer.username"]');
		this.passwordInput = page.locator('input[id="customer.password"]');
		this.confirmPasswordInput = page.locator('input[id="repeatedPassword"]');
		this.registerButton = page.locator('input[value="Register"]');
		this.successMessage = page.locator('text=Your account was created successfully');
		this.errorMessages = page.locator('.error');
		this.welcomeMessage = page.locator('h1.title');
	}

	async navigateToRegister() {
		await this.goto();
		await this.click(this.registerLink);
	}

	async fillRegistrationForm(userData: UserRegistrationData) {
		await this.fill(this.firstNameInput, userData.firstName);
		await this.fill(this.lastNameInput, userData.lastName);
		await this.fill(this.addressInput, userData.address);
		await this.fill(this.cityInput, userData.city);
		await this.fill(this.stateInput, userData.state);
		await this.fill(this.zipCodeInput, userData.zipCode);
		await this.fill(this.phoneInput, userData.phone);
		await this.fill(this.ssnInput, userData.ssn);
		await this.fill(this.usernameInput, userData.username);
		await this.fill(this.passwordInput, userData.password);
		await this.fill(this.confirmPasswordInput, userData.confirmPassword);
	}

	async clickRegister() {
		await this.click(this.registerButton);
	}

	async register(userData: UserRegistrationData) {
		await this.navigateToRegister();
		await this.fillRegistrationForm(userData);
		await this.clickRegister();
	}

	async isRegistrationSuccessful(): Promise<boolean> {
		return await this.isVisible(this.successMessage);
	}

	async getSuccessMessage(): Promise<string> {
		return await this.getText(this.successMessage);
	}

	async getWelcomeMessage(): Promise<string> {
		return await this.getText(this.welcomeMessage);
	}

	async getErrorMessages(): Promise<string[]> {
		const errors = await this.errorMessages.all();
		const errorTexts: string[] = [];
		for (const error of errors) {
			const text = await error.textContent();
			if (text) errorTexts.push(text.trim());
		}
		return errorTexts;
	}
}
