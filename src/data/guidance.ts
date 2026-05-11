export const WORKSHOPS = [
  {
    title: "Homebuying 101",
    category: "Homeownership",
    date: "June 4, 2026",
    time: "6:00 PM – 7:30 PM",
    location: "A+FCU North Branch / Online",
    desc: "Learn what it takes to buy your first home — from pre-approval to closing. Covers budgeting, credit, down payments, and the mortgage process.",
    free: true,
  },
  {
    title: "Build & Repair Your Credit",
    category: "Credit",
    date: "June 11, 2026",
    time: "12:00 PM – 1:00 PM",
    location: "Online (Zoom)",
    desc: "Understand how credit scores work, what hurts your score, and proven strategies to build or rebuild credit over time.",
    free: true,
  },
  {
    title: "Budgeting for Life",
    category: "Budgeting",
    date: "June 18, 2026",
    time: "6:00 PM – 7:00 PM",
    location: "A+FCU South Congress Branch / Online",
    desc: "Build a budget that actually works. Covers the 50/30/20 rule, envelope budgeting, tracking apps, and strategies for sticking to your plan.",
    free: true,
  },
  {
    title: "Intro to Investing",
    category: "Investing",
    date: "June 25, 2026",
    time: "6:00 PM – 7:30 PM",
    location: "Online (Zoom)",
    desc: "Demystify the stock market. Learn about index funds, ETFs, IRAs, 401(k)s, and how to start investing even with a small amount.",
    free: true,
  },
  {
    title: "Retirement Planning at Any Age",
    category: "Retirement",
    date: "July 9, 2026",
    time: "6:00 PM – 7:30 PM",
    location: "A+FCU Cedar Park Branch / Online",
    desc: "Whether you're 25 or 55, this workshop walks you through Social Security, IRAs, 401(k)s, and how to set a realistic retirement savings goal.",
    free: true,
  },
  {
    title: "Protecting Yourself from Fraud",
    category: "Security",
    date: "July 16, 2026",
    time: "12:00 PM – 1:00 PM",
    location: "Online (Zoom)",
    desc: "Learn how scammers target people, how to spot phishing, identity theft, and fraud attempts — and what to do if it happens to you.",
    free: true,
  },
];

export const ARTICLES = [
  {
    category: "Homeownership",
    title: "5 Things to Do Before You Apply for a Mortgage",
    date: "May 3, 2026",
    readTime: "5 min read",
    excerpt: "Getting pre-approved is just the first step. Here's what lenders are really looking for — and how to put your best foot forward.",
    img: "https://aplusfcu.org/wp-content/uploads/blog/img/9-things-to-avoid-mortgage_blog.jpg",
  },
  {
    category: "Credit",
    title: "How to Raise Your Credit Score by 50+ Points",
    date: "April 21, 2026",
    readTime: "6 min read",
    excerpt: "Small, consistent changes to how you use credit can produce big score improvements over time. Here's exactly what moves the needle.",
    img: "https://aplusfcu.org/wp-content/uploads/blog/img/planner_blog.jpg",
  },
  {
    category: "Budgeting",
    title: "The 50/30/20 Budget: Does It Actually Work?",
    date: "April 10, 2026",
    readTime: "4 min read",
    excerpt: "The popular budgeting rule assigns 50% to needs, 30% to wants, and 20% to savings. We break down when it works — and when to adjust it.",
    img: "https://aplusfcu.org/wp-content/uploads/blog/img/planner_blog.jpg",
  },
  {
    category: "Investing",
    title: "Index Funds vs. Actively Managed Funds: Which Is Better?",
    date: "March 28, 2026",
    readTime: "7 min read",
    excerpt: "The data consistently favors low-cost index funds for most long-term investors. Here's a clear breakdown of the tradeoffs.",
    img: "https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp",
  },
  {
    category: "Retirement",
    title: "Roth IRA vs. Traditional IRA: Which Should You Choose?",
    date: "March 15, 2026",
    readTime: "5 min read",
    excerpt: "The right choice depends on your current tax bracket and expected future income. Here's how to think through it.",
    img: "https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_online-services_feb26.webp",
  },
  {
    category: "Security",
    title: "How to Freeze Your Credit (And Why You Might Want To)",
    date: "March 2, 2026",
    readTime: "4 min read",
    excerpt: "A credit freeze is one of the most powerful tools against identity theft — and it's free. Here's how it works and how to set one up.",
    img: "https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp",
  },
];

export const CALCULATORS = [
  { icon: "🏠", title: "Mortgage Calculator", desc: "Estimate your monthly mortgage payment based on home price, down payment, rate, and term.", href: "#" },
  { icon: "🚗", title: "Auto Loan Calculator", desc: "Find out what your monthly car payment will be before you visit the dealership.", href: "#" },
  { icon: "💳", title: "Debt Payoff Calculator", desc: "See how long it will take to pay off your debt and how much interest you'll pay.", href: "#" },
  { icon: "💰", title: "Savings Goal Calculator", desc: "Figure out how much you need to save each month to reach your savings goal.", href: "#" },
  { icon: "📈", title: "Investment Growth Calculator", desc: "See how your investments can grow over time with compound interest.", href: "#" },
  { icon: "🏦", title: "CD / Certificate Calculator", desc: "Calculate how much you'll earn on a certificate of deposit at various rates and terms.", href: "#" },
  { icon: "🎓", title: "Student Loan Calculator", desc: "Estimate monthly payments and total interest on a student loan.", href: "#" },
  { icon: "📋", title: "Budget Calculator", desc: "Input your income and expenses to see where your money is going each month.", href: "#" },
];

export const DEPOSIT_RATES = [
  { product: "Savings", rate: "0.10%", apy: "0.10%", minBalance: "$25", notes: "" },
  { product: "Money Market (Tier 1: $0–$9,999)", rate: "0.25%", apy: "0.25%", minBalance: "$2,500", notes: "" },
  { product: "Money Market (Tier 2: $10K–$24,999)", rate: "0.50%", apy: "0.50%", minBalance: "$2,500", notes: "" },
  { product: "Money Market (Tier 3: $25K+)", rate: "0.75%", apy: "0.75%", minBalance: "$2,500", notes: "" },
  { product: "6-Month Certificate", rate: "4.00%", apy: "4.07%", minBalance: "$500", notes: "" },
  { product: "12-Month Certificate", rate: "4.25%", apy: "4.33%", minBalance: "$500", notes: "Most Popular" },
  { product: "18-Month Certificate", rate: "4.15%", apy: "4.23%", minBalance: "$500", notes: "" },
  { product: "24-Month Certificate", rate: "4.00%", apy: "4.07%", minBalance: "$500", notes: "" },
  { product: "36-Month Certificate", rate: "3.85%", apy: "3.92%", minBalance: "$500", notes: "" },
  { product: "48-Month Certificate", rate: "3.75%", apy: "3.82%", minBalance: "$500", notes: "" },
  { product: "60-Month Certificate", rate: "3.65%", apy: "3.72%", minBalance: "$500", notes: "" },
  { product: "Youth Savings", rate: "0.25%", apy: "0.25%", minBalance: "$5", notes: "" },
];

export const LOAN_RATES = [
  { product: "30-Year Fixed Mortgage", rate: "5.990%", apr: "6.042%", notes: "" },
  { product: "15-Year Fixed Mortgage", rate: "5.625%", apr: "5.709%", notes: "" },
  { product: "5/1 ARM", rate: "5.250%", apr: "6.100%", notes: "" },
  { product: "Home Equity Loan (5-Year)", rate: "5.240%", apr: "5.500%", notes: "" },
  { product: "Home Equity Loan (10-Year)", rate: "5.490%", apr: "5.720%", notes: "" },
  { product: "HELOC", rate: "Prime + 0.00%", apr: "Variable", notes: "" },
  { product: "New Auto (up to 36 mo)", rate: "5.49%", apr: "5.49%", notes: "" },
  { product: "New Auto (37–60 mo)", rate: "5.74%", apr: "5.74%", notes: "" },
  { product: "New Auto (61–84 mo)", rate: "6.49%", apr: "6.49%", notes: "" },
  { product: "Used Auto (up to 60 mo)", rate: "5.74%", apr: "5.74%", notes: "" },
  { product: "Personal Loan", rate: "9.49%", apr: "9.49%", notes: "As low as" },
  { product: "Personal Line of Credit", rate: "10.99%", apr: "10.99%", notes: "As low as" },
  { product: "Visa Platinum Card", rate: "12.90%", apr: "12.90%", notes: "As low as" },
  { product: "Private Student Loan", rate: "5.99%", apr: "5.99%", notes: "As low as" },
];

export const FAQ_ITEMS = [
  {
    q: "How do I become a member of A+FCU?",
    a: "Anyone who lives, works, worships, or attends school in Travis, Williamson, Hays, Bastrop, or Caldwell County is eligible. You can open a membership account online or at any branch with a $5 deposit into a Basic Savings account.",
  },
  {
    q: "Is my money safe at a credit union?",
    a: "Yes. All A+FCU deposits are federally insured up to $250,000 per depositor by the National Credit Union Administration (NCUA) — the credit union equivalent of FDIC insurance for banks.",
  },
  {
    q: "How do I set up direct deposit?",
    a: "Provide your employer with A+FCU's routing number (314977405) and your account number. You can find both in online banking under account details, or on a printed check.",
  },
  {
    q: "What is A+FCU's routing number?",
    a: "A+FCU's ABA routing number is 314977405. Use this for direct deposit, wire transfers, ACH payments, and tax refunds.",
  },
  {
    q: "How do I report a lost or stolen debit/credit card?",
    a: "You can instantly freeze your card in the A+ Mobile App or A+ Online Banking. To report it lost or stolen, call us 24/7 at 1-800-252-8148 or visit any branch.",
  },
  {
    q: "Can I use my A+FCU debit card at any ATM?",
    a: "Yes. A+FCU participates in the Co-Op ATM network, giving you surcharge-free access to over 85,000 ATMs nationwide — including at most 7-Eleven and Walgreens locations.",
  },
  {
    q: "How do I send a wire transfer?",
    a: "Wire transfers can be initiated in A+ Online Banking (domestic only) or by visiting any branch in person. International wires require a branch visit. See our Fee Schedule for current wire transfer fees.",
  },
  {
    q: "What do I need to open a checking account?",
    a: "You'll need a government-issued photo ID, your Social Security Number, and a minimum opening deposit. You must also be (or become) an A+FCU member with a Basic Savings account.",
  },
  {
    q: "Does A+FCU offer business accounts?",
    a: "Yes. A+FCU offers a full suite of business accounts including Business Checking, Business Savings, Money Market, Certificates, and business lending products. Visit our Business Banking section to learn more.",
  },
  {
    q: "How do I dispute a transaction?",
    a: "If you see a charge you don't recognize, first try to identify the merchant. If you still believe it's unauthorized, contact us at 1-800-252-8148 or visit any branch to file a dispute. For debit card disputes, act within 60 days of the statement date.",
  },
];

export const SWITCH_KIT_STEPS = [
  { n: "1", title: "Open Your A+FCU Account", desc: "Open a checking and savings account at A+FCU online or at any branch. It only takes a few minutes." },
  { n: "2", title: "Update Direct Deposit", desc: "Give your employer A+FCU's routing number (314977405) and your new account number. Most employers process the change within 1–2 pay periods." },
  { n: "3", title: "Move Automatic Payments", desc: "Log in to each biller and update your payment method to your new A+FCU account. Our Switch Kit checklist helps you track each one." },
  { n: "4", title: "Keep Your Old Account Open", desc: "Leave your old account open and funded for 30–60 days while automatic payments and direct deposits transition to A+FCU." },
  { n: "5", title: "Close Your Old Account", desc: "Once all payments have moved and direct deposit is confirmed at A+FCU, you can safely close your old account." },
];
