export interface AdminAccount {
  id: string;
  type: "Checking" | "Savings" | "Money Market" | "Certificate" | "IRA";
  name: string;
  accountNumber: string;
  balance: number;
  availableBalance: number;
  apy: number;
  openDate: string;
}

export interface AdminLoan {
  id: string;
  type: "Mortgage" | "Auto" | "Personal" | "Student" | "Credit Card" | "HELOC";
  name: string;
  accountNumber: string;
  balance: number;
  originalAmount: number;
  rate: number;
  monthlyPayment: number;
  nextDueDate: string;
  term: string;
}

export interface AdminTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  accountId: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberNumber: string;
  memberSince: string;
  status: "active" | "suspended" | "pending";
  address: string;
  city: string;
  state: string;
  zip: string;
  accounts: AdminAccount[];
  loans: AdminLoan[];
  transactions: AdminTransaction[];
  dashboardWidgets: {
    showAlerts: boolean;
    showTransactions: boolean;
    showLoanProgress: boolean;
    showRates: boolean;
  };
  notes: string;
}

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "u001",
    name: "Maria Gonzalez",
    email: "maria.gonzalez@email.com",
    phone: "(512) 555-0142",
    memberNumber: "1042837",
    memberSince: "2018-03-14",
    status: "active",
    address: "4821 Shoal Creek Blvd",
    city: "Austin",
    state: "TX",
    zip: "78756",
    accounts: [
      { id: "a001", type: "Checking", name: "Cash-Back Checking", accountNumber: "****4821", balance: 3_847.52, availableBalance: 3_747.52, apy: 0.0, openDate: "2018-03-14" },
      { id: "a002", type: "Savings", name: "Regular Savings", accountNumber: "****4822", balance: 12_540.00, availableBalance: 12_540.00, apy: 0.25, openDate: "2018-03-14" },
      { id: "a003", type: "Money Market", name: "Money Market Plus", accountNumber: "****4823", balance: 28_000.00, availableBalance: 28_000.00, apy: 1.85, openDate: "2020-07-01" },
    ],
    loans: [
      { id: "l001", type: "Mortgage", name: "30-Yr Fixed Mortgage", accountNumber: "****9001", balance: 187_450.00, originalAmount: 240_000.00, rate: 5.99, monthlyPayment: 1_438.00, nextDueDate: "2026-06-01", term: "30 years" },
      { id: "l002", type: "Auto", name: "Auto Loan – 2022 Honda CR-V", accountNumber: "****9002", balance: 14_200.00, originalAmount: 28_000.00, rate: 4.49, monthlyPayment: 524.00, nextDueDate: "2026-05-20", term: "60 months" },
    ],
    transactions: [
      { id: "t001", date: "2026-05-10", description: "Payroll Deposit – City of Austin", amount: 2_840.00, type: "credit", accountId: "a001" },
      { id: "t002", date: "2026-05-09", description: "HEB Grocery #4812", amount: 134.72, type: "debit", accountId: "a001" },
      { id: "t003", date: "2026-05-08", description: "Austin Energy Bill Pay", amount: 89.50, type: "debit", accountId: "a001" },
      { id: "t004", date: "2026-05-07", description: "Transfer to Savings", amount: 500.00, type: "debit", accountId: "a001" },
      { id: "t005", date: "2026-05-07", description: "Transfer from Checking", amount: 500.00, type: "credit", accountId: "a002" },
      { id: "t006", date: "2026-05-06", description: "Netflix Subscription", amount: 15.99, type: "debit", accountId: "a001" },
    ],
    dashboardWidgets: { showAlerts: true, showTransactions: true, showLoanProgress: true, showRates: true },
    notes: "",
  },
  {
    id: "u002",
    name: "James Whitfield",
    email: "j.whitfield@outlook.com",
    phone: "(512) 555-0388",
    memberNumber: "2187643",
    memberSince: "2015-09-01",
    status: "active",
    address: "1190 E 11th St",
    city: "Austin",
    state: "TX",
    zip: "78702",
    accounts: [
      { id: "a004", type: "Checking", name: "Free Checking", accountNumber: "****7712", balance: 1_205.44, availableBalance: 1_155.44, apy: 0.0, openDate: "2015-09-01" },
      { id: "a005", type: "Savings", name: "Regular Savings", accountNumber: "****7713", balance: 4_200.00, availableBalance: 4_200.00, apy: 0.25, openDate: "2015-09-01" },
      { id: "a006", type: "Certificate", name: "18-Month Certificate", accountNumber: "****7714", balance: 10_000.00, availableBalance: 0, apy: 4.85, openDate: "2025-08-01" },
    ],
    loans: [
      { id: "l003", type: "Auto", name: "Auto Loan – 2024 Toyota Tacoma", accountNumber: "****8801", balance: 31_900.00, originalAmount: 38_500.00, rate: 5.24, monthlyPayment: 726.00, nextDueDate: "2026-05-15", term: "60 months" },
      { id: "l004", type: "Personal", name: "Personal Loan", accountNumber: "****8802", balance: 3_450.00, originalAmount: 7_500.00, rate: 9.99, monthlyPayment: 245.00, nextDueDate: "2026-05-22", term: "36 months" },
    ],
    transactions: [
      { id: "t007", date: "2026-05-10", description: "Direct Deposit – Dell Technologies", amount: 3_190.00, type: "credit", accountId: "a004" },
      { id: "t008", date: "2026-05-09", description: "Torchy's Tacos", amount: 28.45, type: "debit", accountId: "a004" },
      { id: "t009", date: "2026-05-08", description: "Amazon.com", amount: 67.88, type: "debit", accountId: "a004" },
      { id: "t010", date: "2026-05-07", description: "Auto Loan Payment", amount: 726.00, type: "debit", accountId: "a004" },
    ],
    dashboardWidgets: { showAlerts: true, showTransactions: true, showLoanProgress: true, showRates: false },
    notes: "Preferred contact: email only.",
  },
  {
    id: "u003",
    name: "Sandra Okafor",
    email: "sandra.okafor@gmail.com",
    phone: "(512) 555-0761",
    memberNumber: "3309211",
    memberSince: "2022-01-18",
    status: "active",
    address: "3304 Guadalupe St Apt 5",
    city: "Austin",
    state: "TX",
    zip: "78705",
    accounts: [
      { id: "a007", type: "Checking", name: "Cash-Back Checking", accountNumber: "****2231", balance: 7_894.12, availableBalance: 7_894.12, apy: 0.0, openDate: "2022-01-18" },
      { id: "a008", type: "Savings", name: "Regular Savings", accountNumber: "****2232", balance: 33_000.00, availableBalance: 33_000.00, apy: 0.25, openDate: "2022-01-18" },
    ],
    loans: [
      { id: "l005", type: "Mortgage", name: "15-Yr Fixed Mortgage", accountNumber: "****6601", balance: 203_800.00, originalAmount: 250_000.00, rate: 4.75, monthlyPayment: 1_948.00, nextDueDate: "2026-06-01", term: "15 years" },
    ],
    transactions: [
      { id: "t011", date: "2026-05-10", description: "Direct Deposit – UT Austin", amount: 4_600.00, type: "credit", accountId: "a007" },
      { id: "t012", date: "2026-05-09", description: "Whole Foods Market", amount: 211.30, type: "debit", accountId: "a007" },
      { id: "t013", date: "2026-05-08", description: "Mortgage Payment", amount: 1_948.00, type: "debit", accountId: "a007" },
    ],
    dashboardWidgets: { showAlerts: false, showTransactions: true, showLoanProgress: true, showRates: true },
    notes: "",
  },
  {
    id: "u004",
    name: "Derek Lamont",
    email: "dereklamont@yahoo.com",
    phone: "(512) 555-0924",
    memberNumber: "4401988",
    memberSince: "2020-06-30",
    status: "suspended",
    address: "908 W Cesar Chavez St",
    city: "Austin",
    state: "TX",
    zip: "78703",
    accounts: [
      { id: "a009", type: "Checking", name: "Free Checking", accountNumber: "****0091", balance: 47.22, availableBalance: 0.00, apy: 0.0, openDate: "2020-06-30" },
      { id: "a010", type: "Savings", name: "Regular Savings", accountNumber: "****0092", balance: 250.00, availableBalance: 250.00, apy: 0.25, openDate: "2020-06-30" },
    ],
    loans: [
      { id: "l006", type: "Credit Card", name: "Visa Platinum Card", accountNumber: "****3344", balance: 2_891.00, originalAmount: 5_000.00, rate: 17.99, monthlyPayment: 75.00, nextDueDate: "2026-05-18", term: "Revolving" },
    ],
    transactions: [
      { id: "t014", date: "2026-05-02", description: "ATM Withdrawal", amount: 40.00, type: "debit", accountId: "a009" },
      { id: "t015", date: "2026-05-01", description: "Overdraft Fee", amount: 30.00, type: "debit", accountId: "a009" },
    ],
    dashboardWidgets: { showAlerts: true, showTransactions: true, showLoanProgress: false, showRates: false },
    notes: "Account suspended pending fraud review. Contact compliance before reactivating.",
  },
  {
    id: "u005",
    name: "Priya Nair",
    email: "priya.nair@protonmail.com",
    phone: "(512) 555-0315",
    memberNumber: "5512047",
    memberSince: "2019-11-05",
    status: "active",
    address: "7200 Hart Ln Unit 204",
    city: "Austin",
    state: "TX",
    zip: "78731",
    accounts: [
      { id: "a011", type: "Checking", name: "Cash-Back Checking", accountNumber: "****5501", balance: 9_321.00, availableBalance: 9_321.00, apy: 0.0, openDate: "2019-11-05" },
      { id: "a012", type: "Money Market", name: "Money Market Plus", accountNumber: "****5502", balance: 52_800.00, availableBalance: 52_800.00, apy: 1.85, openDate: "2021-02-10" },
      { id: "a013", type: "IRA", name: "IRA Certificate", accountNumber: "****5503", balance: 18_500.00, availableBalance: 0, apy: 5.10, openDate: "2023-01-15" },
    ],
    loans: [
      { id: "l007", type: "HELOC", name: "Home Equity Line of Credit", accountNumber: "****7701", balance: 22_000.00, originalAmount: 50_000.00, rate: 7.50, monthlyPayment: 412.00, nextDueDate: "2026-05-25", term: "10 years" },
      { id: "l008", type: "Student", name: "Student Loan Refinance", accountNumber: "****7702", balance: 8_900.00, originalAmount: 32_000.00, rate: 5.50, monthlyPayment: 340.00, nextDueDate: "2026-05-28", term: "120 months" },
    ],
    transactions: [
      { id: "t016", date: "2026-05-10", description: "Payroll – Apple Inc.", amount: 6_200.00, type: "credit", accountId: "a011" },
      { id: "t017", date: "2026-05-09", description: "Trader Joe's", amount: 94.21, type: "debit", accountId: "a011" },
      { id: "t018", date: "2026-05-08", description: "HELOC Payment", amount: 412.00, type: "debit", accountId: "a011" },
    ],
    dashboardWidgets: { showAlerts: true, showTransactions: true, showLoanProgress: true, showRates: true },
    notes: "",
  },
  {
    id: "u006",
    name: "Travis Bellamy",
    email: "travis.b@icloud.com",
    phone: "(512) 555-0677",
    memberNumber: "6623519",
    memberSince: "2023-04-22",
    status: "pending",
    address: "5620 Burnet Rd",
    city: "Austin",
    state: "TX",
    zip: "78756",
    accounts: [
      { id: "a014", type: "Savings", name: "Regular Savings", accountNumber: "****8811", balance: 5.00, availableBalance: 5.00, apy: 0.25, openDate: "2023-04-22" },
    ],
    loans: [],
    transactions: [],
    dashboardWidgets: { showAlerts: true, showTransactions: false, showLoanProgress: false, showRates: true },
    notes: "New membership application pending ID verification.",
  },
  {
    id: "u007",
    name: "Carol Tran",
    email: "carol.tran55@gmail.com",
    phone: "(512) 555-0214",
    memberNumber: "7734082",
    memberSince: "2017-08-12",
    status: "active",
    address: "2402 Longview St",
    city: "Austin",
    state: "TX",
    zip: "78705",
    accounts: [
      { id: "a015", type: "Checking", name: "Cash-Back Checking", accountNumber: "****3310", balance: 5_672.80, availableBalance: 5_672.80, apy: 0.0, openDate: "2017-08-12" },
      { id: "a016", type: "Savings", name: "Regular Savings", accountNumber: "****3311", balance: 19_850.00, availableBalance: 19_850.00, apy: 0.25, openDate: "2017-08-12" },
      { id: "a017", type: "Certificate", name: "12-Month Certificate", accountNumber: "****3312", balance: 25_000.00, availableBalance: 0, apy: 5.25, openDate: "2025-05-01" },
    ],
    loans: [
      { id: "l009", type: "Auto", name: "Auto Loan – 2023 Kia Telluride", accountNumber: "****4401", balance: 22_100.00, originalAmount: 36_000.00, rate: 4.99, monthlyPayment: 678.00, nextDueDate: "2026-05-12", term: "60 months" },
    ],
    transactions: [
      { id: "t019", date: "2026-05-10", description: "Direct Deposit – HEB Grocery", amount: 2_480.00, type: "credit", accountId: "a015" },
      { id: "t020", date: "2026-05-08", description: "Target Store #4418", amount: 77.40, type: "debit", accountId: "a015" },
      { id: "t021", date: "2026-05-07", description: "Auto Insurance – State Farm", amount: 148.00, type: "debit", accountId: "a015" },
    ],
    dashboardWidgets: { showAlerts: true, showTransactions: true, showLoanProgress: true, showRates: false },
    notes: "",
  },
  {
    id: "u008",
    name: "Elijah Moreno",
    email: "elijahmoreno@hotmail.com",
    phone: "(512) 555-0534",
    memberNumber: "8845173",
    memberSince: "2021-03-07",
    status: "active",
    address: "9401 Research Blvd Suite 100",
    city: "Austin",
    state: "TX",
    zip: "78759",
    accounts: [
      { id: "a018", type: "Checking", name: "Free Checking", accountNumber: "****6620", balance: 2_119.37, availableBalance: 2_019.37, apy: 0.0, openDate: "2021-03-07" },
      { id: "a019", type: "Savings", name: "Regular Savings", accountNumber: "****6621", balance: 8_400.00, availableBalance: 8_400.00, apy: 0.25, openDate: "2021-03-07" },
    ],
    loans: [
      { id: "l010", type: "Mortgage", name: "30-Yr Fixed Mortgage", accountNumber: "****5501", balance: 312_000.00, originalAmount: 340_000.00, rate: 6.75, monthlyPayment: 2_206.00, nextDueDate: "2026-06-01", term: "30 years" },
      { id: "l011", type: "Auto", name: "Auto Loan – 2025 Tesla Model 3", accountNumber: "****5502", balance: 38_700.00, originalAmount: 42_000.00, rate: 3.99, monthlyPayment: 771.00, nextDueDate: "2026-05-19", term: "60 months" },
    ],
    transactions: [
      { id: "t022", date: "2026-05-10", description: "ACH Deposit – Freelance", amount: 1_800.00, type: "credit", accountId: "a018" },
      { id: "t023", date: "2026-05-09", description: "Costco Wholesale", amount: 189.55, type: "debit", accountId: "a018" },
      { id: "t024", date: "2026-05-07", description: "Mortgage Payment", amount: 2_206.00, type: "debit", accountId: "a018" },
      { id: "t025", date: "2026-05-06", description: "Spotify Premium", amount: 9.99, type: "debit", accountId: "a018" },
    ],
    dashboardWidgets: { showAlerts: false, showTransactions: true, showLoanProgress: true, showRates: true },
    notes: "",
  },
];

const STORAGE_KEY = "aplusfcu_admin_users";

export function getAdminUsers(): AdminUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_USERS;
}

export function saveAdminUsers(users: AdminUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getAdminUser(id: string): AdminUser | undefined {
  return getAdminUsers().find((u) => u.id === id);
}

export function updateAdminUser(updated: AdminUser) {
  const users = getAdminUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
    saveAdminUsers(users);
  }
}

export function resetAdminUsers() {
  localStorage.removeItem(STORAGE_KEY);
}

export const ADMIN_PASSWORD = "admin1234";
export const ADMIN_AUTH_KEY = "aplusfcu_admin_auth";
