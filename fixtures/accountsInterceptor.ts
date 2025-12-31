import { Page } from '@playwright/test';
import { AccuntsIdsArrayData } from '../types';

export async function api_waitForAccountsLoad(page: Page): Promise<AccuntsIdsArrayData[]> {
	const response = await page.waitForResponse(
		response => response.url().includes('/services_proxy/bank/customers/') && response.url().includes('/accounts')
	);

	return response.json();
}

export async function api_waitForCreateAccount(page: Page): Promise<void> {
	await page.waitForResponse(
		response => response.url().includes('/services_proxy/bank/createAccount')
	);
}

export async function api_getCustomerIdFromNetwork(page: Page): Promise<number> {
	const response = await page.waitForResponse(
		response => response.url().includes('/services_proxy/bank/customers/') && response.url().includes('/accounts')
	);

	const url = response.url();
	const customersIndex = url.indexOf('/customers/');
	const accountsIndex = url.indexOf('/accounts');

	const customerIdString = url.substring(customersIndex + '/customers/'.length, accountsIndex);
	return parseInt(customerIdString);
}
