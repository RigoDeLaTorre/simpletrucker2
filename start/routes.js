"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
// Route.on('/').render('pages/welcome')
// Route.on('/').render('pages/home')

// Route.get("/", "PageController.welcome");
Route.get("/", "AuthController.login");

Route.get("/home", "PageController.home");
Route.get("/home/addcredits", ({ view }) => {
  return view.render("pages/user/userNoCredits");
});
Route.get("/purchases/fetchPurchases", "CheckoutController.fetchPurchases");

Route.post("/api/stripe10", "ApiController.stripe10");
Route.post("/api/stripe30", "ApiController.stripe30");
Route.post("/api/stripe50", "ApiController.stripe50");

Route.get("/driver/active", "PageController.activeLoad");
Route.get("/driver/delivered", "PageController.deliveredLoad");
Route.get("/driver/load/:id/:invoiceid", "PageController.loaddetails");
Route.get("/driver/adduser/:id/:name", "PageController.createDriverUser");
Route.get(
  "/driver/updateEmail/:id/:firstname/:lastname",
  "PageController.updateDriverEmail"
);
Route.get("/driver/adduserTest", "PageController.createDriverUserTest");
Route.get("/driver/showDrivers", "PageController.showDrivers");
// User - On iniial successful login
Route.get("/api/getUserInfo", "ApiController.getUserInfo");

Route.get("/api/uploadAwsFile", "ApiController.uploadAwsFile");
Route.delete("/api/deleteAwsFile", "ApiController.deleteAwsFile");

// ************Auth *****************
Route.get("/register", "AuthController.register");
Route.post("/register", "AuthController.storeUser");
Route.post("/registerDriver", "AuthController.storeUserDriver");
Route.get("/login", "AuthController.login");
Route.post("/login", "AuthController.loginUser");
Route.get("/logout", "AuthController.logout");
// ************Auth - Password Reset*****************

//forgot pass page
Route.get("/forgot-password", "PasswordResetController.forgotPassword");
// user hits forgot pass, it sends a reset pass link
Route.post("/password/email", "PasswordResetController.sendRequestLinkEmail");
// reset link leads to this page
Route.get("/password/reset/:token", "PasswordResetController.showResetForm");
// form action to submit new pass
Route.post("/password/reset", "PasswordResetController.reset");

// Company APi
Route.post("/api/createProfile", "CompanyController.createProfile");
Route.get("/api/fetchProfile", "CompanyController.fetchProfile");
Route.put("/api/updateCompany", "CompanyController.updateCompany");

//Customer APi
Route.post("/api/createCustomer", "CustomerController.createCustomer");
Route.get("/api/fetchCustomers", "CustomerController.fetchCustomers");
Route.put("/api/updateCustomer", "CustomerController.updateCustomer");
Route.delete("/customer/deleteCustomer", "CustomerController.deleteCustomer");

//Driver APi
Route.post("/api/createDriver", "DriverController.createDriver");
Route.get("/api/fetchDrivers", "DriverController.fetchDrivers");
Route.put("/api/updateDriver", "DriverController.updateDriver");
Route.put("/api/updateDriverPatch", "DriverController.updateDriverPatch");
Route.delete("/driver/deleteDriver", "DriverController.deleteDriver");

// Route.post('/api/updateDriver', 'DriverController.updateDriver')

//Load APi
Route.post("/api/createLoad", "LoadController.createLoad");
Route.put("/api/updateLoad", "LoadController.updateLoad");
Route.put("/api/deleteLoad", "LoadController.deleteLoad");
Route.put(
  "/api/updateLoadProcessedPayment",
  "LoadController.updateLoadProcessedPayment"
);
Route.get("/api/fetchAllLoadsDetails", "LoadController.fetchAllLoadsDetails");
Route.delete("/api/deletePickup", "LoadController.deletePickup");
Route.delete("/api/deleteDelivery", "LoadController.deleteDelivery");
Route.put("/api/updateLoadStatus", "LoadController.updateLoadStatus");

Route.post("/api/uploadRateBol", "ApiController.uploadRateBol");
Route.put("/api/updateDriverPayroll", "LoadController.updateDriverPayroll");

//Truck APi
Route.post("/api/createTruck", "TruckController.createTruck");
Route.get("/api/fetchTrucks", "TruckController.fetchTrucks");
Route.put("/api/updateTruck", "TruckController.updateTruck");
Route.delete("/truck/deleteTruck", "TruckController.deleteTruck");

//Trailers
Route.get("/trailer/fetchTrailers", "TrailerController.fetchTrailers");
Route.post("/trailer/createTrailer", "TrailerController.createTrailer");
Route.put("/trailer/updateTrailer", "TrailerController.updateTrailer");
Route.delete("/trailer/deleteTrailer", "TrailerController.deleteTrailer");
//Expense List
Route.post(
  "/api/createTruckList",
  "TruckexpenselistController.createTruckList"
);

Route.post(
  "/api/createTruckExpense",
  "TruckexpenselistController.createTruckExpense"
);
Route.get(
  "/api/fetchExpenseTypes",
  "TruckexpenselistController.fetchExpenseTypes"
);
Route.put(
  "/api/updateExpenseType",
  "TruckexpenselistController.updateExpenseType"
);

//Expense Record
Route.post(
  "/api/createTruckExpenseRecord",
  "TruckexpenseController.createTruckExpenseRecord"
);
Route.put(
  "/api/updateExpenseRecord",
  "TruckexpenseController.updateExpenseRecord"
);
Route.get(
  "/api/fetchTruckExpenseRecords",
  "TruckexpenseController.fetchTruckExpenseRecords"
);

Route.get("/api/fetchExpenses", "ApiController.fetchExpenses");

//Vendors
Route.get("/vendor/fetchVendors", "VendorController.fetchVendors");

Route.post("/vendor/createVendor", "VendorController.createVendor");
Route.put("/vendor/updateVendor", "VendorController.updateVendor");
Route.delete("/vendor/deleteVendor", "VendorController.deleteVendor");

//Expense Record

Route.get(
  "/expense/fetchExpenseRecords",
  "ExpenseController.fetchExpenseRecords"
);

Route.post(
  "/expense/createExpenseRecord",
  "ExpenseController.createExpenseRecord"
);
Route.put(
  "/expense/updateExpenseRecord",
  "ExpenseController.updateExpenseRecord"
);
Route.delete(
  "/expense/deleteExpenseRecord",
  "ExpenseController.deleteExpenseRecord"
);

//Category Expenses
Route.get(
  "/category/fetchCategoryExpenses",
  "CategoryExpenseController.fetchCategoryExpenses"
);

Route.post(
  "/category/createCategoryExpense",
  "CategoryExpenseController.createCategoryExpense"
);
Route.put(
  "/category/updateCategoryExpense",
  "CategoryExpenseController.updateCategoryExpense"
);
Route.delete(
  "/category/deleteCategoryExpense",
  "CategoryExpenseController.deleteCategoryExpense"
);

//Category Expense Types
Route.get(
  "/expense/type/fetchExpenseTypes",
  "CategoryExpenseTypeController.fetchExpenseTypes"
);

Route.post(
  "/expense/type/createExpenseType",
  "CategoryExpenseTypeController.createExpenseType"
);
Route.put(
  "/expense/type/updateExpenseType",
  "CategoryExpenseTypeController.updateExpenseType"
);
Route.delete(
  "/expense/type/deleteExpenseType",
  "CategoryExpenseTypeController.deleteExpenseType"
);

//*************** AWS *************//
Route.get("/attachment/uploadAwsFile", "AttachmentController.uploadAwsFile");
Route.get(
  "/attachment/uploadAwsFileLoads",
  "AttachmentController.uploadAwsFileLoads"
);
Route.delete("/attachment/deleteAwsFile", "AttachmentController.deleteAwsFile");
Route.delete(
  "/attachment/deleteAwsFileLoads",
  "AttachmentController.deleteAwsFileLoads"
);
//User Settings
Route.get("/settings/fetch", "UserSettingController.fetch");
Route.put("/settings/update", "UserSettingController.update");

Route.get("/themes/fetch", "ThemeOptionController.fetch");

Route.get("/*", "PageController.home");
