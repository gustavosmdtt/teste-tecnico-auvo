import { Page, Locator } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export class BasePage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		if (process.env.BASE_URL) {
			await this.page.goto(`${process.env.BASE_URL}/index.htm`);
		} else {
			await this.page.goto('/index.htm');
		}
	}

	async waitForElement(locator: Locator, timeout: number = 30000) {
		await locator.waitFor({ state: 'visible', timeout });
	}

	async fill(locator: Locator, text: string) {
		await locator.fill(text);
	}

	async click(locator: Locator) {
		await locator.click();
	}

	async getText(locator: Locator): Promise<string> {
		return await locator.textContent() || '';
	}

	async isVisible(locator: Locator): Promise<boolean> {
		return await locator.isVisible();
	}

	getTimestamp(): string {
		return Date.now().toString();
	}

	generateUsername(): string {
		return `user_${this.getTimestamp()}`;
	}
}
