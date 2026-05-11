export type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  tags: string[];
};

export const SEARCH_INDEX: SearchResult[] = [
  // --- Pages ---
  {
    id: "home",
    title: "Home",
    description: "A+ Federal Credit Union — Banking on each other. Building stronger communities.",
    href: "/",
    category: "Pages",
    tags: ["home", "a+fcu", "credit union", "banking"],
  },
  {
    id: "join",
    title: "Join A+FCU — Become a Member",
    description: "Open your A+ Federal Credit Union membership in minutes. No application fee, soft credit check only.",
    href: "/join",
    category: "Pages",
    tags: ["join", "membership", "become a member", "open account", "apply"],
  },
  {
    id: "rates",
    title: "Rates — Competitive Rates, Updated Daily",
    description: "Current rates on all A+FCU loan and deposit products — mortgages, auto loans, certificates, money markets, and more.",
    href: "/guidance/rates",
    category: "Pages",
    tags: ["rates", "apr", "apy", "interest rate", "loan rate", "deposit rate"],
  },
  {
    id: "locations",
    title: "Locations — Find a Branch or ATM",
    description: "20+ branch locations across Central Texas plus 30,000+ surcharge-free ATMs nationwide.",
    href: "/locations",
    category: "Pages",
    tags: ["locations", "branch", "atm", "near me", "austin", "cedar park", "round rock"],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    description: "Reach A+FCU by phone, mail, live chat, or secure message. Contact Center: Mon–Fri 8:30 AM–6 PM, Sat 9 AM–1 PM.",
    href: "/contact-us",
    category: "Pages",
    tags: ["contact", "phone", "email", "chat", "help", "support", "routing number"],
  },

  // --- Accounts ---
  {
    id: "accounts",
    title: "Accounts Overview",
    description: "Checking, savings, certificates, and youth accounts — all with no monthly fees.",
    href: "/accounts",
    category: "Accounts",
    tags: ["accounts", "banking", "open account"],
  },
  {
    id: "cash-back-checking",
    title: "Cash-Back Checking",
    description: "Earn up to 3% cash back on every debit card purchase. Get paid up to 2 days early with direct deposit. No minimum balance, no monthly fee.",
    href: "/accounts/checking",
    category: "Accounts",
    tags: ["checking", "cash back", "debit card", "checking account", "free checking"],
  },
  {
    id: "free-checking",
    title: "Free Checking",
    description: "Simple, no-fee checking with no minimum balance requirement. Free debit card, online and mobile banking, and bill pay.",
    href: "/accounts/checking",
    category: "Accounts",
    tags: ["free checking", "checking account", "no fee", "debit card"],
  },
  {
    id: "savings",
    title: "Savings Accounts",
    description: "Regular savings, money market, and holiday/vacation club accounts with competitive dividend rates.",
    href: "/accounts/savings",
    category: "Accounts",
    tags: ["savings", "money market", "holiday club", "vacation club", "dividends"],
  },
  {
    id: "money-market",
    title: "Money Market Account",
    description: "Earn tiered dividends on higher balances. $2,500 minimum opening deposit. No monthly service fee with qualifying balance.",
    href: "/accounts/savings",
    category: "Accounts",
    tags: ["money market", "savings", "high yield", "tiered rate"],
  },
  {
    id: "certificates",
    title: "Share Certificates",
    description: "Earn up to 4.33% APY on 12-month certificates. Fixed rates with terms from 6 to 60 months. $500 minimum deposit.",
    href: "/accounts/certificates",
    category: "Accounts",
    tags: ["certificate", "cd", "share certificate", "fixed rate", "4.33%", "apy", "term deposit"],
  },
  {
    id: "ira-certificates",
    title: "IRA Certificates",
    description: "Tax-advantaged retirement savings with the security of a fixed-rate certificate. Traditional and Roth IRA options.",
    href: "/accounts/certificates",
    category: "Accounts",
    tags: ["ira", "roth ira", "traditional ira", "retirement", "certificate"],
  },
  {
    id: "youth-accounts",
    title: "Youth Accounts",
    description: "Kids accounts (0–12), teen accounts (13–17), and student accounts designed to teach healthy financial habits early.",
    href: "/accounts/youth",
    category: "Accounts",
    tags: ["youth", "kids", "teen", "student", "children", "minor", "young adult"],
  },

  // --- Loans ---
  {
    id: "loans",
    title: "Loans Overview",
    description: "Home loans, auto loans, personal credit, and student loans — competitive rates and local decisions.",
    href: "/loans",
    category: "Loans",
    tags: ["loans", "borrow", "apply", "lending"],
  },
  {
    id: "mortgage-purchase",
    title: "Mortgage Purchase",
    description: "Buy your home with rates as low as 5.990% APR. Close by Sept 30 and get a $500 lender credit. Free pre-approval, local underwriting.",
    href: "/loans/home-loans",
    category: "Loans",
    tags: ["mortgage", "home loan", "purchase", "buy a home", "house", "real estate", "pre-approval"],
  },
  {
    id: "mortgage-refinance",
    title: "Mortgage Refinance",
    description: "Lower your payment or access your equity. Rates as low as 5.625% APR. Close in as little as 21 days.",
    href: "/loans/home-loans",
    category: "Loans",
    tags: ["refinance", "mortgage refi", "lower payment", "cash out", "rate and term"],
  },
  {
    id: "home-equity",
    title: "Home Equity Loan",
    description: "Borrow up to 90% of your home's equity at a fixed rate. 5–20 year terms. Rates as low as 5.240% APR.",
    href: "/loans/home-loans",
    category: "Loans",
    tags: ["home equity", "equity loan", "heloc", "home improvement", "debt consolidation"],
  },
  {
    id: "heloc",
    title: "HELOC — Home Equity Line of Credit",
    description: "Flexible access to your home's equity with a revolving line of credit. Variable rate tied to Prime.",
    href: "/loans/home-loans",
    category: "Loans",
    tags: ["heloc", "home equity line", "line of credit", "revolving credit", "home improvement"],
  },
  {
    id: "auto-purchase",
    title: "Auto Purchase Loan",
    description: "Finance a new or used vehicle starting at 5.49% APR. Get pre-approved before you visit the dealership.",
    href: "/loans/vehicle-loans",
    category: "Loans",
    tags: ["auto loan", "car loan", "vehicle", "new car", "used car", "truck", "auto purchase"],
  },
  {
    id: "auto-refinance",
    title: "Auto Refinance",
    description: "Beat your current auto loan rate by 1% APR for a limited time. Refinance your car loan and save.",
    href: "/loans/vehicle-loans",
    category: "Loans",
    tags: ["auto refinance", "car refinance", "lower rate", "vehicle loan", "save money"],
  },
  {
    id: "rv-boat",
    title: "RV, Boat & Motorcycle Loans",
    description: "Finance recreational vehicles including RVs, boats, and motorcycles at competitive rates.",
    href: "/loans/vehicle-loans",
    category: "Loans",
    tags: ["rv", "boat", "motorcycle", "recreational vehicle", "atv", "watercraft"],
  },
  {
    id: "personal-loan",
    title: "Personal Loan",
    description: "Fast funding for any purpose — rates as low as 9.49% APR. Apply online, get funds as soon as tomorrow.",
    href: "/loans/personal-credit",
    category: "Loans",
    tags: ["personal loan", "unsecured loan", "fast funding", "emergency", "vacation", "wedding"],
  },
  {
    id: "credit-cards",
    title: "Credit Cards",
    description: "A+ Visa Platinum credit card with rates as low as 12.90% APR. No annual fee, rewards and cash back options.",
    href: "/loans/personal-credit",
    category: "Loans",
    tags: ["credit card", "visa", "platinum", "rewards", "cash back credit card", "no annual fee"],
  },
  {
    id: "line-of-credit",
    title: "Personal Line of Credit",
    description: "Flexible revolving credit when you need it — rates as low as 10.99% APR. Draw and repay as needed.",
    href: "/loans/personal-credit",
    category: "Loans",
    tags: ["line of credit", "revolving credit", "personal credit", "overdraft protection"],
  },
  {
    id: "student-loans",
    title: "Student Loans",
    description: "Private student loans and refinancing for higher education. Rates as low as 5.99% APR.",
    href: "/loans/student-loans",
    category: "Loans",
    tags: ["student loan", "college", "education", "financial aid", "private student loan", "refinance student loan"],
  },

  // --- Services ---
  {
    id: "online-banking",
    title: "A+ Online Banking",
    description: "Access your accounts, pay bills, move money, apply for loans, and monitor your credit score — anytime, anywhere.",
    href: "/services/online-banking",
    category: "Services",
    tags: ["online banking", "internet banking", "account access", "bill pay", "login"],
  },
  {
    id: "mobile-app",
    title: "A+ Mobile App",
    description: "Award-winning mobile banking app for iPhone and Android. Mobile deposit, Zelle, card management, and more.",
    href: "/services/mobile-banking",
    category: "Services",
    tags: ["mobile app", "mobile banking", "iphone", "android", "app", "mobile deposit", "zelle"],
  },
  {
    id: "mobile-deposit",
    title: "Mobile Deposit",
    description: "Deposit checks from anywhere using the A+ Mobile App. Just snap a photo of your check.",
    href: "/services/mobile-banking",
    category: "Services",
    tags: ["mobile deposit", "check deposit", "remote deposit", "deposit check"],
  },
  {
    id: "zelle",
    title: "Zelle® — Send Money Fast",
    description: "Send and receive money directly between bank accounts in minutes — no fees — with Zelle through the A+ Mobile App.",
    href: "/services/mobile-banking",
    category: "Services",
    tags: ["zelle", "send money", "transfer money", "p2p", "payment"],
  },
  {
    id: "direct-deposit",
    title: "Direct Deposit",
    description: "Set up direct deposit with a free online tool and get paid up to 2 days early. Instant setup, no paper forms.",
    href: "/services/member-services",
    category: "Services",
    tags: ["direct deposit", "paycheck", "early pay", "payroll", "setup direct deposit"],
  },
  {
    id: "wire-transfers",
    title: "Wire Transfers",
    description: "Send domestic and international wire transfers securely through A+FCU. Routing number: 314977104.",
    href: "/services/member-services",
    category: "Services",
    tags: ["wire transfer", "domestic wire", "international wire", "routing number", "send money"],
  },
  {
    id: "credit-score",
    title: "Free Credit Score Monitoring",
    description: "Monitor your credit score with free monthly updates inside A+ Online Banking. No hard inquiry — enroll today.",
    href: "/services/online-banking",
    category: "Services",
    tags: ["credit score", "credit monitoring", "free credit score", "credit report", "fico"],
  },
  {
    id: "card-management",
    title: "Card Management",
    description: "Lock, unlock, set spending limits, and receive instant alerts on your A+FCU debit or credit card.",
    href: "/services/online-banking",
    category: "Services",
    tags: ["card management", "freeze card", "lock card", "debit card controls", "alerts"],
  },
  {
    id: "digital-wallets",
    title: "Digital Wallets",
    description: "Add your A+FCU debit or credit card to Apple Pay, Google Pay, and Samsung Pay for contactless payments.",
    href: "/services/mobile-banking",
    category: "Services",
    tags: ["apple pay", "google pay", "samsung pay", "digital wallet", "contactless", "tap to pay"],
  },
  {
    id: "insurance-investments",
    title: "Insurance & Investments",
    description: "Protect what matters and grow your wealth with A+FCU Wealth Management. Insurance, IRAs, HSAs, and investment services.",
    href: "/services/insurance-investments",
    category: "Services",
    tags: ["insurance", "investments", "wealth management", "ira", "hsa", "retirement planning"],
  },

  // --- Business ---
  {
    id: "business",
    title: "Business Banking Overview",
    description: "Full-service business banking including checking, savings, lending, and merchant services for Central Texas businesses.",
    href: "/business",
    category: "Business",
    tags: ["business banking", "small business", "commercial", "business account"],
  },
  {
    id: "business-checking",
    title: "Business Checking",
    description: "Business checking accounts designed to support businesses of all sizes — with online bill pay and cash management tools.",
    href: "/business/accounts",
    category: "Business",
    tags: ["business checking", "business account", "commercial checking", "business banking"],
  },
  {
    id: "business-loans",
    title: "Business Loans & Lines of Credit",
    description: "Financing to grow your business — secured and unsecured loans, lines of credit, and commercial real estate loans.",
    href: "/business/lending",
    category: "Business",
    tags: ["business loan", "commercial loan", "sba", "line of credit", "business lending", "small business loan"],
  },
  {
    id: "merchant-services",
    title: "Merchant Services",
    description: "Accept credit and debit card payments for your business with competitive processing rates and reliable equipment.",
    href: "/business/services",
    category: "Business",
    tags: ["merchant services", "payment processing", "credit card processing", "pos", "point of sale"],
  },

  // --- Guidance / Articles ---
  {
    id: "guidance",
    title: "Guidance — Financial Education",
    description: "Free workshops, calculators, articles, and tools to help you make smarter financial decisions.",
    href: "/guidance",
    category: "Guidance",
    tags: ["guidance", "financial education", "learning", "workshops", "resources"],
  },
  {
    id: "article-mortgage-mistakes",
    title: "What To Avoid During The Mortgage Process: 9 Common Mistakes",
    description: "Avoid these 9 common mistakes buyers make during the mortgage process to help ensure your application stays on course.",
    href: "/guidance/financial-education",
    category: "Articles",
    tags: ["mortgage", "homebuying", "tips", "mistakes", "article", "blog"],
  },
  {
    id: "article-financial-tips",
    title: "16 Months Of Financial Tips",
    description: "Use these monthly financial tips to break down your top financial tasks and get on the right path to financial health.",
    href: "/guidance/financial-education",
    category: "Articles",
    tags: ["financial tips", "budgeting", "money management", "article", "monthly tips"],
  },
  {
    id: "article-kids-money",
    title: "Want To Teach Your Kids About Money? Start With These 6 Lessons",
    description: "Help your kids build smart money habits early with practical tips on saving, spending, and financial responsibility.",
    href: "/guidance/financial-education",
    category: "Articles",
    tags: ["kids", "children", "money lessons", "financial literacy", "youth", "article"],
  },
  {
    id: "workshop-homebuying",
    title: "Workshop: Homebuying 101",
    description: "Free workshop — Learn what it takes to buy your first home: pre-approval, budgeting, credit, down payments, and the mortgage process. June 4, 2026.",
    href: "/guidance/financial-education",
    category: "Workshops",
    tags: ["workshop", "homebuying", "first time home buyer", "mortgage", "free event"],
  },
  {
    id: "workshop-credit",
    title: "Workshop: Build & Repair Your Credit",
    description: "Free workshop — Understand credit scores, what hurts your score, and proven strategies to build or rebuild credit. June 11, 2026.",
    href: "/guidance/financial-education",
    category: "Workshops",
    tags: ["workshop", "credit score", "credit repair", "build credit", "free event"],
  },
  {
    id: "workshop-budgeting",
    title: "Workshop: Budgeting for Life",
    description: "Free workshop — Build a budget that actually works. Covers the 50/30/20 rule, envelope budgeting, and tracking apps. June 18, 2026.",
    href: "/guidance/financial-education",
    category: "Workshops",
    tags: ["workshop", "budgeting", "50/30/20", "money management", "free event"],
  },
  {
    id: "calculators",
    title: "Financial Calculators",
    description: "Free calculators for mortgage payments, auto loans, debt payoff, savings goals, investment growth, and more.",
    href: "/guidance/tools",
    category: "Tools",
    tags: ["calculator", "mortgage calculator", "auto loan calculator", "savings calculator", "debt payoff", "tools"],
  },
  {
    id: "financial-tools",
    title: "Tools & Support",
    description: "Make a payment, download the switch kit to move your banking to A+FCU, or find answers in our FAQ.",
    href: "/guidance/tools",
    category: "Tools",
    tags: ["tools", "make payment", "switch kit", "faq", "support", "help"],
  },

  // --- Who We Are ---
  {
    id: "about",
    title: "About A+ Federal Credit Union",
    description: "Founded in 1949, A+FCU is a not-for-profit credit union serving Central Texas with 22+ branches and 85,000+ members.",
    href: "/who-we-are/about",
    category: "About",
    tags: ["about", "history", "who we are", "not for profit", "credit union", "community", "1949"],
  },
  {
    id: "careers",
    title: "Careers at A+FCU",
    description: "Join the A+FCU team. We're a Top Workplaces award winner with competitive benefits and a mission-driven culture.",
    href: "/who-we-are/about",
    category: "About",
    tags: ["careers", "jobs", "employment", "hiring", "work at a+fcu", "top workplaces"],
  },
  {
    id: "community",
    title: "Community Involvement — A+ Gives",
    description: "A+FCU is committed to giving back to Central Texas through sponsorships, volunteering, scholarships, and youth programs.",
    href: "/who-we-are/community",
    category: "About",
    tags: ["community", "a+ gives", "volunteer", "sponsorship", "scholarship", "charity", "nonprofit"],
  },
  {
    id: "member-benefits",
    title: "Member Benefits",
    description: "Refer & Earn, PlusPoints rewards, member discounts, and the Golden Apple Club for senior members.",
    href: "/who-we-are/membership",
    category: "About",
    tags: ["member benefits", "refer a friend", "pluspoints", "discounts", "rewards", "golden apple"],
  },

  // --- Quick Facts ---
  {
    id: "routing-number",
    title: "Routing Number — 314977104",
    description: "A+FCU's ABA routing number is 314977104. Use it for direct deposit, wire transfers, and other bank-to-bank transactions.",
    href: "/contact-us#routing-number",
    category: "Quick Info",
    tags: ["routing number", "aba", "314977104", "direct deposit", "wire transfer", "routing"],
  },
  {
    id: "phone-number",
    title: "Phone Number — 512.302.6800",
    description: "Call A+FCU at 512.302.6800 or toll-free 800.252.8148. Contact Center hours: Mon–Fri 8:30 AM–6 PM, Sat 9 AM–1 PM.",
    href: "/contact-us",
    category: "Quick Info",
    tags: ["phone", "call", "contact", "512-302-6800", "800-252-8148", "hours"],
  },
  {
    id: "ncua",
    title: "NCUA Insured — Up to $250,000",
    description: "All A+FCU deposits are federally insured by the NCUA up to $250,000 per depositor. Your money is safe.",
    href: "/who-we-are/about",
    category: "Quick Info",
    tags: ["ncua", "insured", "fdic", "safe", "deposit insurance", "federal insurance"],
  },
];

export function searchIndex(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return SEARCH_INDEX.filter((item) => {
    const haystack = [
      item.title,
      item.description,
      item.category,
      ...item.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q) || q.split(/\s+/).every((word) => haystack.includes(word));
  }).sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
    const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
    return aTitle - bTitle;
  });
}

export const POPULAR_SEARCHES = [
  "Routing Number",
  "Mortgage Rates",
  "Auto Loan",
  "Online Banking",
  "Locations",
  "Certificate Rates",
  "Direct Deposit",
  "Personal Loan",
];

export const CATEGORIES = [
  "All",
  "Accounts",
  "Loans",
  "Services",
  "Business",
  "Guidance",
  "Articles",
  "Workshops",
  "Tools",
  "About",
  "Quick Info",
  "Pages",
] as const;

export type Category = (typeof CATEGORIES)[number];
