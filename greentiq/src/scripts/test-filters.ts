import { queryCustomers, addCustomer, getSavedFilters, reorderSavedFilters } from "../lib/api/db";
import { customerSchema } from "../lib/schemas";

async function runFilterCompositionTests() {
  console.log("=== RUNNING ADVANCED CRM COMPREHENSIVE TEST SUITE ===\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  // Test 1: Pure Search
  const searchResult = await queryCustomers({ search: "acme" });
  assert(
    searchResult.data.length > 0 &&
      searchResult.data.every(
        (c) =>
          c.name.toLowerCase().includes("acme") ||
          c.email.toLowerCase().includes("acme") ||
          c.company.toLowerCase().includes("acme")
      ),
    "Search 'acme' returns items containing 'acme' in name, email, or company"
  );

  // Test 2: Status multi-select filter
  const statusResult = await queryCustomers({ status: ["active", "prospect"] });
  assert(
    statusResult.data.length > 0 &&
      statusResult.data.every((c) => c.status === "active" || c.status === "prospect"),
    "Filter by status ['active', 'prospect'] returns strictly active or prospect customers"
  );

  // Test 3: Company multi-select filter
  const companyResult = await queryCustomers({ companies: ["Acme Corp", "Globex"] });
  assert(
    companyResult.data.length > 0 &&
      companyResult.data.every((c) => c.company === "Acme Corp" || c.company === "Globex"),
    "Filter by company ['Acme Corp', 'Globex'] returns only customers from those companies"
  );

  // Test 4: Composition of Search + Status + Company (AND Logic)
  const combinedResult = await queryCustomers({
    search: "a",
    status: ["active"],
    companies: ["Acme Corp"],
  });
  assert(
    combinedResult.data.every((c) => {
      const matchSearch =
        c.name.toLowerCase().includes("a") ||
        c.email.toLowerCase().includes("a") ||
        c.company.toLowerCase().includes("a");
      const matchStatus = c.status === "active";
      const matchCompany = c.company === "Acme Corp";
      return matchSearch && matchStatus && matchCompany;
    }),
    "Combined Search ('a') + Status ('active') + Company ('Acme Corp') composes correctly (AND logic)"
  );

  // Test 5: Date Range + Email filter
  const dateEmailResult = await queryCustomers({
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    emailContains: "@",
  });
  assert(
    dateEmailResult.data.every((c) => {
      const contactTime = new Date(c.lastContactDate).getTime();
      const fromTime = new Date("2024-01-01").getTime();
      const toTime = new Date("2026-12-31T23:59:59.999Z").getTime();
      return contactTime >= fromTime && contactTime <= toTime && c.email.includes("@");
    }),
    "Date Range + Email filter composes correctly"
  );

  // Test 6: Zod validation failure on POST payload
  const badPayload = {
    name: "",
    email: "invalid-email-address",
    phone: "abc",
    status: "invalid-status",
  };
  const validationResult = customerSchema.safeParse(badPayload);
  assert(!validationResult.success, "Zod schema correctly rejects invalid customer payload");
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    assert(
      Boolean(fieldErrors.name && fieldErrors.email && fieldErrors.phone),
      "Validation returns field-level error structure for name, email, phone"
    );
  }

  // Test 7: Zod partial validation failure on PATCH payload
  const badPatchPayload = { email: "bad-patch-email" };
  const patchValidation = customerSchema.partial().safeParse(badPatchPayload);
  assert(!patchValidation.success, "PATCH partial validation correctly rejects invalid email string");
  if (!patchValidation.success) {
    const fieldErrors = patchValidation.error.flatten().fieldErrors;
    assert(Boolean(fieldErrors.email), "PATCH validation returns field-level error for email");
  }

  // Test 8: Pre-built filter templates seed check
  const initialFilters = await getSavedFilters();
  const templateNames = initialFilters.map((f) => f.name);
  assert(
    templateNames.includes("Active Customers") &&
      templateNames.includes("Recent Contacts") &&
      templateNames.includes("Inactive Leads"),
    "Pre-built filter templates (Active Customers, Recent Contacts, Inactive Leads) exist on initial load"
  );

  // Test 9: Saved filter reordering
  const reversedIds = initialFilters.map((f) => f.id).reverse();
  const reorderedFilters = await reorderSavedFilters(reversedIds);
  assert(
    reorderedFilters[0].id === reversedIds[0] && reorderedFilters[0].order === 0,
    "Saved filters reorder correctly and update order index"
  );

  console.log(`\n=== RESULTS: ${passedTests} / ${totalTests} TESTS PASSED ===\n`);
}

runFilterCompositionTests().catch(console.error);
