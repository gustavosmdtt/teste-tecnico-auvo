import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

export class LoginPage extends BasePage {
	readonly usernameInput: Locator;
	readonly passwordInput: Locator;
	readonly loginButton: Locator;
	readonly errorMessage: Locator;
	readonly welcomeMessage: Locator;
	readonly logoutLink: Locator;

	constructor(page: Page) {
		super(page);
		this.usernameInput = page.locator('input[name="username"]');
		this.passwordInput = page.locator('input[name="password"]');
		this.loginButton = page.locator('input[value="Log In"]');
		this.errorMessage = page.locator('.error');
		this.welcomeMessage = page.locator('p.smallText');
		this.logoutLink = page.locator('a[href*="logout"]');
	}

	async login(username: string, password: string) {
		await this.goto();
		await this.fill(this.usernameInput, username);
		await this.fill(this.passwordInput, password);
		await this.click(this.loginButton);
	}

	async isLoginSuccessful(): Promise<boolean> {
		return await this.isVisible(this.welcomeMessage);
	}

	async getWelcomeMessage(): Promise<string> {
		return await this.getText(this.welcomeMessage);
	}

	async hasErrorMessage(): Promise<boolean> {
		return await this.isVisible(this.errorMessage);
	}

	async getErrorMessage(): Promise<string> {
		return await this.getText(this.errorMessage);
	}

	async logout() {
		await this.click(this.logoutLink);
	}
}
