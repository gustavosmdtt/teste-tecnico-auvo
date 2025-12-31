import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BillPayPage } from '../pages/BillPayPage';
import { AccountsPage } from '../pages/AccountsPage';
import { testData } from '../fixtures/testData';
import { api_waitForAccountsLoad } from '../fixtures/accountsInterceptor';
import { BillPaymentData } from '../types';

test.describe('Pagamento de Contas', () => {
	let loginPage: LoginPage;
	let billPayPage: BillPayPage;
	let accountsPage: AccountsPage;
	let paymentData: BillPaymentData;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		billPayPage = new BillPayPage(page);
		accountsPage = new AccountsPage(page);

		await loginPage.login(testData.testUser.username, testData.testUser.password);
		let accounts = await api_waitForAccountsLoad(page);

		if (accounts.length < 2) {
			await accountsPage.openNewAccount('SAVINGS');

			await accountsPage.navigateToAccountsOverview();
			await api_waitForAccountsLoad(page);
		}

		const userAccountId = accounts.length > 0 ? accounts[1].id : '';

		paymentData = {
			payeeName: 'Electric Company',
			address: '123 Power St',
			city: 'Energy City',
			state: 'CA',
			zipCode: '12345',
			phone: '555-1234',
			account: userAccountId.toString(),
			verifyAccount: userAccountId.toString(),
			amount: '10.00'
		};
	});

	test('Should complete bill payment successfully', async () => {
		await billPayPage.navigateToBillPay();
		await billPayPage.fillBillPaymentForm(paymentData);

		const selectedFromAccount = await billPayPage.getSelectedFromAccount();

		await billPayPage.clickSendPayment();

		await expect(billPayPage.successMessage).toBeVisible();

		const successTitle = await billPayPage.getSuccessTitle();
		expect(successTitle).toContain('Bill Payment Complete');

		const resultPayeeName = await billPayPage.getPaymentResultPayeeName();
		expect(resultPayeeName).toBe(paymentData.payeeName);

		const resultAmount = await billPayPage.getPaymentResultAmount();
		expect(resultAmount).toBe(`$${paymentData.amount}`);

		const resultFromAccountId = await billPayPage.getPaymentResultFromAccountId();
		expect(resultFromAccountId).toBe(selectedFromAccount);
	});

	test('Should show errors when required fields are empty', async () => {
		await billPayPage.navigateToBillPay();
		await billPayPage.clickSendPayment();

		const errorElements = await billPayPage.errorMessage.all();
		const visibleErrors = [];

		for (const error of errorElements) {
			if (await error.isVisible()) {
				visibleErrors.push(error);
			}
		}

		expect(visibleErrors.length).toBeGreaterThan(0);

		for (const error of visibleErrors) {
			await expect(error).toBeVisible();
		}
	});

	test('Should validate account numbers match', async () => {
		paymentData.account = '12345';
		paymentData.verifyAccount = '54321';

		await billPayPage.sendPayment(paymentData);

		await expect(billPayPage.errorMisMatch).toBeVisible();

		const errorMismatch = await billPayPage.getErrorMismatch();
		expect(errorMismatch).toBe('The account numbers do not match.');
	});

	test('Should show error when amount is zero', async () => {
		const amountZeroPaymentData = {
			...paymentData,
			amount: '0'
		}

		await billPayPage.sendPayment(amountZeroPaymentData);

		await expect(billPayPage.errorMessage).toBeVisible();

		const errorMessage = await billPayPage.getErrorMessages();
		expect(errorMessage.length).toBeTruthy();
	});

	test('Should show error when balance is insufficient', async () => {
		const insufficientAmountPaymentData = {
			...paymentData,
			amount: '99999999.99'
		}

		await billPayPage.sendPayment(insufficientAmountPaymentData);

		await expect(billPayPage.errorMessage).toBeVisible();

		const errorMessage = await billPayPage.getErrorMessages();
		expect(errorMessage).toBeTruthy();
	});

	test('Should validate payee account is different from user account', async () => {
		const accountsIds = await api_waitForAccountsLoad(accountsPage.page);
		const secondAccountId = accountsIds[0];

		const sameAccountIdPaymentData = {
			...paymentData,
			account: secondAccountId.toString(),
			verifyAccount: secondAccountId.toString()
		}

		await billPayPage.sendPayment(sameAccountIdPaymentData);

		const hasError = await billPayPage.hasErrorMessage();
		expect(hasError).toBeTruthy();
	});
});
