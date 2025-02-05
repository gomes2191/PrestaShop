// Import utils
import helper from '@utils/helpers';

// Import test context
import testContext from '@utils/testContext';

require('module-alias/register');

// Import utils
const {getDateFormat} = require('@utils/date');

// Import login steps
const loginCommon = require('@commonTests/BO/loginBO');

// Import pages
const dashboardPage = require('@pages/BO/dashboard');
const ordersPage = require('@pages/BO/orders');

// Import and init data
const {Orders} = require('@data/demo/orders');

const today = getDateFormat('yyyy-mm-dd');
const dateToCheck = getDateFormat('mm/dd/yyyy');

const baseContext = 'functional_BO_orders_orders_filterOrders';
// Import expect from chai
const {expect} = require('chai');

let browserContext;
let page;
let numberOfOrders;

/*
Filter orders By :
Id, reference, new client, delivery, customer, total, payment, status and date from, date to
*/
describe('BO - Orders : Filter the Orders table', async () => {
  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);
    page = await helper.newTab(browserContext);
  });
  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  it('should login in BO', async function () {
    await loginCommon.loginBO(this, page);
  });

  it('should go to \'Orders > Orders\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToOrdersPage', baseContext);

    await dashboardPage.goToSubMenu(
      page,
      dashboardPage.ordersParentLink,
      dashboardPage.ordersLink,
    );

    const pageTitle = await ordersPage.getPageTitle(page);
    await expect(pageTitle).to.contains(ordersPage.pageTitle);
  });

  it('should reset all filters and get number of orders', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'resetFiltersFirst', baseContext);

    numberOfOrders = await ordersPage.resetAndGetNumberOfLines(page);
    await expect(numberOfOrders).to.be.above(0);
  });

  const tests = [
    {
      args:
        {
          identifier: 'filterById',
          filterType: 'input',
          filterBy: 'id_order',
          filterValue: Orders.firstOrder.id,
        },
    },
    {
      args:
        {
          identifier: 'filterByReference',
          filterType: 'input',
          filterBy: 'reference',
          filterValue: Orders.fourthOrder.ref,
        },
    },
    {
      args:
        {
          identifier: 'filterByNewClient',
          filterType: 'select',
          filterBy: 'new',
          filterValue: Orders.firstOrder.newClient,
        },
    },
    {
      args:
        {
          identifier: 'filterByDelivery',
          filterType: 'select',
          filterBy: 'country_name',
          filterValue: Orders.firstOrder.delivery,
        },
    },
    {
      args:
        {
          identifier: 'filterByCustomer',
          filterType: 'input',
          filterBy: 'customer',
          filterValue: Orders.firstOrder.customer,
        },
    },
    {
      args:
        {
          identifier: 'filterByTotalPaid',
          filterType: 'input',
          filterBy: 'total_paid_tax_incl',
          filterValue: Orders.fourthOrder.totalPaid,
        },
    },
    {
      args:
        {
          identifier: 'filterByPayment',
          filterType: 'input',
          filterBy: 'payment',
          filterValue: Orders.firstOrder.paymentMethod,
        },
    },
    {
      args:
        {
          identifier: 'filterOsName',
          filterType: 'select',
          filterBy: 'osname',
          filterValue: Orders.thirdOrder.status,
        },
    },
  ];

  tests.forEach((test) => {
    it(`should filter the Orders table by '${test.args.filterBy}' and check the result`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', test.args.identifier, baseContext);

      await ordersPage.filterOrders(
        page,
        test.args.filterType,
        test.args.filterBy,
        test.args.filterValue,
      );

      const numberOfOrdersAfterFilter = await ordersPage.getNumberOfElementInGrid(page);
      await expect(numberOfOrdersAfterFilter).to.be.at.most(numberOfOrders);

      for (let row = 1; row <= numberOfOrdersAfterFilter; row++) {
        const textColumn = await ordersPage.getTextColumn(page, test.args.filterBy, row);
        await expect(textColumn).to.equal(test.args.filterValue);
      }
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `${test.args.identifier}Reset`, baseContext);

      const numberOfOrdersAfterReset = await ordersPage.resetAndGetNumberOfLines(page);
      await expect(numberOfOrdersAfterReset).to.be.equal(numberOfOrders);
    });
  });

  it('should filter the orders table by \'Date from\' and \'Date to\'', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'filterByDate', baseContext);

    // Filter orders
    await ordersPage.filterOrdersByDate(page, today, today);

    // Check number of element
    const numberOfOrdersAfterFilter = await ordersPage.getNumberOfElementInGrid(page);
    await expect(numberOfOrdersAfterFilter).to.be.at.most(numberOfOrders);

    for (let i = 1; i <= numberOfOrdersAfterFilter; i++) {
      const textColumn = await ordersPage.getTextColumn(page, 'date_add', i);
      await expect(textColumn).to.contains(dateToCheck);
    }
  });

  it('should reset all filters', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'resetFilter', baseContext);

    const numberOfOrdersAfterReset = await ordersPage.resetAndGetNumberOfLines(page);
    await expect(numberOfOrdersAfterReset).to.be.equal(numberOfOrders);
  });
});
