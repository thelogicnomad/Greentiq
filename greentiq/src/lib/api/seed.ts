import { faker } from "@faker-js/faker";
import { Customer, CustomerStatus, SavedFilter } from "@/types";

export const COMPANIES = [
  "Acme Corp",
  "Globex",
  "Stark Industries",
  "Innovatech",
  "Wayne Enterprises",
  "Cyberdyne",
  "Umbrella Corp",
  "Aperture Science",
];

export const STATUSES: CustomerStatus[] = ["active", "prospect", "lead", "inactive", "archived"];

export const ACCOUNT_OWNERS = [
  "Alex Rivera",
  "Sarah Chen",
  "Marcus Vance",
  "Elena Rostova",
  "David Miller",
];

export function generateSeedCustomers(count = 150): Customer[] {
  // Set fixed seed for deterministic behavior
  faker.seed(12345);

  const customers: Customer[] = [];
  const usedEmails = new Set<string>();

  const baseDate = new Date(2026, 7, 1); // August 2026

  for (let i = 0; i < count; i++) {
    let email = faker.internet.email().toLowerCase();
    while (usedEmails.has(email)) {
      email = faker.internet.email().toLowerCase();
    }
    usedEmails.add(email);

    const company = COMPANIES[i % COMPANIES.length];
    const status = STATUSES[i % STATUSES.length];
    const accountOwner = ACCOUNT_OWNERS[i % ACCOUNT_OWNERS.length];

    const daysAgoCreated = faker.number.int({ min: 30, max: 730 });
    const daysAgoContacted = faker.number.int({ min: 1, max: daysAgoCreated });

    const createdDate = new Date(baseDate.getTime() - daysAgoCreated * 24 * 60 * 60 * 1000).toISOString();
    const lastContactDate = new Date(baseDate.getTime() - daysAgoContacted * 24 * 60 * 60 * 1000).toISOString();

    const noteCount = faker.number.int({ min: 1, max: 4 });
    const notes = Array.from({ length: noteCount }, (_, noteIndex) => {
      const noteDaysAgo = faker.number.int({ min: 0, max: daysAgoContacted });
      const noteDate = new Date(baseDate.getTime() - noteDaysAgo * 24 * 60 * 60 * 1000).toISOString();
      return {
        id: `note-${i + 1}-${noteIndex + 1}`,
        content: faker.helpers.arrayElement([
          "Discussed Q4 expansion budget and software integration requirements.",
          "Sent proposal overview. Client requested a follow-up demo next week.",
          "Met at Tech Summit. Showed strong interest in Enterprise plan features.",
          "Followed up via email regarding contract renewal options.",
          "Initial discovery call completed. Identified 3 key pain points.",
          "Logged support request update regarding API rate limits.",
        ]),
        createdAt: noteDate,
      };
    });

    customers.push({
      id: `cust-${i + 1}`,
      name: faker.person.fullName(),
      email,
      phone: faker.phone.number({ style: "national" }),
      company,
      status,
      jobTitle: faker.person.jobTitle(),
      dealValue: faker.number.int({ min: 5000, max: 120000 }),
      accountOwner,
      lastContactDate,
      createdDate,
      notes,
    });
  }

  return customers;
}

export function generateSeedSavedFilters(): SavedFilter[] {
  return [
    {
      id: "filter-1",
      name: "Active Customers",
      isPinned: true,
      order: 0,
      filters: {
        status: ["active"],
        companies: [],
      },
    },
    {
      id: "filter-2",
      name: "Recent Contacts",
      isPinned: true,
      order: 1,
      filters: {
        status: ["active", "prospect", "lead"],
        companies: [],
      },
    },
    {
      id: "filter-3",
      name: "Inactive Leads",
      isPinned: true,
      order: 2,
      filters: {
        status: ["inactive", "lead"],
        companies: [],
      },
    },
    {
      id: "filter-4",
      name: "High-value prospects",
      isPinned: false,
      order: 3,
      filters: {
        status: ["prospect"],
        companies: ["Acme Corp", "Stark Industries", "Wayne Enterprises"],
      },
    },
  ];
}
