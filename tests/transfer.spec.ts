import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { testData } from '../fixtures/testData';
import { api_waitForAccountsLoad } from '../fixtures/accountsInterceptor';
import { AccuntsIdsArrayData } from '../types';

test.describe('Transferência entre Contas', () => {
	let loginPage: LoginPage;
	let transferPage: TransferFundsPage;
	let arrAccounts: AccuntsIdsArrayData[]; 

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		transferPage = new TransferFundsPage(page);

		await loginPage.login(testData.testUser.username, testData.testUser.password);
		arrAccounts = await api_waitForAccountsLoad(page);
	});

	test('Should transfer funds successfully', async () => {
		const transferAmount = '50.00';
		const fromAccount = arrAccounts[0].id.toString();
		const toAccount = arrAccounts[1].id.toString();

		await transferPage.navigateToTransfer();
		await transferPage.transfer(transferAmount, fromAccount, toAccount);

		await expect(transferPage.successMessage).toBeVisible();

		const successTitle = await transferPage.getSuccessTitle();
		expect(successTitle).toBe('Transfer Complete!');

		const resultAmount = await transferPage.getTransferResultAmount();
		expect(resultAmount).toBe(`$${transferAmount}`);

		const resultFromAccount = await transferPage.getTransferResultFromAccount();
		expect(resultFromAccount).toBe(fromAccount);

		const resultToAccount = await transferPage.getTransferResultToAccount();
		expect(resultToAccount).toBe(toAccount);

		expect(resultFromAccount).not.toBe(resultToAccount);
	});

	test('Should show error when amount is empty', async () => {
		await transferPage.transfer('');

		await expect(transferPage.errorMessageTitle).toBeVisible();

		const errorMessageBody = await transferPage.getErrorMessageBody();
		expect(errorMessageBody).toBe('An internal error has occurred and has been logged.');
	});

	test('Should show error when amount is invalid', async () => {
		await transferPage.transfer('abc');

		await expect(transferPage.errorMessageTitle).toBeVisible();

		const errorMessageBody = await transferPage.getErrorMessageBody();
		expect(errorMessageBody).toBe('An internal error has occurred and has been logged.');
	});

	test('Should show error when transfer amount is zero', async () => {
		await transferPage.transfer('0');

		await expect(transferPage.errorMessageTitle).toBeVisible();

		const errorMessageBody = await transferPage.getErrorMessageBody();
		expect(errorMessageBody).toBe('An internal error has occurred and has been logged.');
	});

	test('Should show error when transfer amount is negative', async () => {
		await transferPage.transfer('-50.00');

		await expect(transferPage.errorMessageTitle).toBeVisible();

		const errorMessageBody = await transferPage.getErrorMessageBody();
		expect(errorMessageBody).toBe('An internal error has occurred and has been logged.');
	});

	test('Should show error when balance is insufficient', async () => {
		await transferPage.transfer('99999999');

		await expect(transferPage.errorMessageTitle).toBeVisible();

		const errorMessageBody = await transferPage.getErrorMessageBody();
		expect(errorMessageBody).toBe('An internal error has occurred and has been logged.');
	});
});
