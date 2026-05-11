import navAccounts from "@/assets/nav/accounts.webp";
import navLoans from "@/assets/nav/loans.webp";
import navServices from "@/assets/nav/services.webp";
import navBusiness from "@/assets/nav/business.webp";
import navWho from "@/assets/nav/who.webp";
import navGuidance from "@/assets/nav/guidance.webp";

export type NavLink = { label: string; href: string };
export type NavColumn = { title: string; href: string; links: NavLink[] };
export type NavFeatured = { image: string; title: string; body: string; href: string };
export type NavItem = {
  label: string;
  href: string;
  /** Layout: columns are placed left-to-right; if rows present, each row is a strip of columns. */
  rows: NavColumn[][];
  featured: NavFeatured;
};

export const NAV: NavItem[] = [
  {
    label: "Accounts",
    href: "/accounts",
    rows: [
      [
        { title: "Checking Accounts", href: "/accounts/checking", links: [
          { label: "Cash-Back Checking", href: "/accounts/checking" },
          { label: "A+ Checking", href: "/accounts/checking" },
          { label: "Value Checking", href: "/accounts/checking" },
        ]},
        { title: "Savings Accounts", href: "/accounts/savings", links: [
          { label: "Membership Savings", href: "/accounts/savings" },
          { label: "Tiered Money Market", href: "/accounts/savings" },
        ]},
        { title: "Certificates", href: "/accounts/certificates", links: [
          { label: "StartUP Certificate", href: "/accounts/certificates" },
          { label: "Share Certificates", href: "/accounts/certificates" },
          { label: "New Money Advantage Certificates", href: "/accounts/certificates" },
        ]},
      ],
      [
        { title: "", href: "", links: [] },
        { title: "Investments", href: "/services/insurance-investments", links: [
          { label: "A+ Wealth Management", href: "/services/insurance-investments" },
          { label: "IRAs", href: "/services/insurance-investments" },
          { label: "HSAs", href: "/services/insurance-investments" },
        ]},
        { title: "", href: "", links: [] },
      ],
    ],
    featured: {
      image: navAccounts,
      title: "Don't Miss An Early Payday!",
      body: "Set up direct deposit with our FREE online tool to get paid up to 2 days early.*",
      href: "/services/member-services",
    },
  },
  {
    label: "Loans",
    href: "/loans",
    rows: [
      [
        { title: "Home Loans", href: "/loans/home-loans", links: [
          { label: "Purchases", href: "/loans/home-loans" },
          { label: "Refinance", href: "/loans/home-loans" },
          { label: "Home Equity", href: "/loans/home-loans" },
        ]},
        { title: "Vehicle Loans", href: "/loans/vehicle-loans", links: [
          { label: "Car & Truck Loans", href: "/loans/vehicle-loans" },
          { label: "RVs, Motorcycles, & More", href: "/loans/vehicle-loans" },
          { label: "Partner Dealerships", href: "/loans/vehicle-loans" },
        ]},
        { title: "Personal Credit", href: "/loans/personal-credit", links: [
          { label: "A+ Personal Loan", href: "/loans/personal-credit" },
          { label: "A+ Preferred Line of Credit", href: "/loans/personal-credit" },
          { label: "Credit Cards", href: "/loans/personal-credit" },
          { label: "A+ Holiday Loan", href: "/loans/personal-credit" },
        ]},
      ],
      [
        { title: "", href: "", links: [] },
        { title: "Make A Payment", href: "/guidance/tools", links: [
          { label: "Make A Payment", href: "/guidance/tools" },
        ]},
        { title: "", href: "", links: [] },
      ],
    ],
    featured: {
      image: navLoans,
      title: "Refi Your Auto Loan To Save Big",
      body: "For a limited time, beat your current auto loan rate by 1% APR!*†",
      href: "/loans/vehicle-loans",
    },
  },
  {
    label: "Services",
    href: "/services",
    rows: [
      [
        { title: "Online Banking", href: "/services/online-banking", links: [
          { label: "A+ Online Banking", href: "/services/online-banking" },
          { label: "Bill Pay", href: "/services/online-banking" },
          { label: "Financial Tools", href: "/services/online-banking" },
          { label: "Credit Score", href: "/services/online-banking" },
          { label: "Card Management", href: "/services/online-banking" },
          { label: "Resources", href: "/services/online-banking" },
        ]},
        { title: "Mobile Banking", href: "/services/mobile-banking", links: [
          { label: "A+ Mobile App", href: "/services/mobile-banking" },
          { label: "Mobile Deposit", href: "/services/mobile-banking" },
          { label: "Zelle®", href: "/services/mobile-banking" },
          { label: "Mobile Wallet", href: "/services/mobile-banking" },
          { label: "Resources", href: "/services/mobile-banking" },
        ]},
        { title: "Member Services", href: "/services/member-services", links: [
          { label: "Debit Cards", href: "/services/member-services" },
          { label: "Direct Deposit & Payroll Deduction", href: "/services/member-services" },
          { label: "Overdraft Protections", href: "/services/member-services" },
          { label: "Wire Transfers", href: "/services/member-services" },
          { label: "Insurance & Protection", href: "/services/insurance-investments" },
          { label: "Order Checks", href: "/services/member-services" },
        ]},
      ],
    ],
    featured: {
      image: navServices,
      title: "Are You On Fraud Alert?",
      body: "Use our free resources to help protect your finances.",
      href: "/guidance/financial-education",
    },
  },
  {
    label: "Business",
    href: "/business",
    rows: [
      [
        { title: "Business Accounts", href: "/business/accounts", links: [
          { label: "Checking Accounts", href: "/business/accounts" },
          { label: "Membership Savings", href: "/business/accounts" },
        ]},
        { title: "Business Loans", href: "/business/lending", links: [
          { label: "Real Estate Loans", href: "/business/lending" },
          { label: "Secured & Unsecured Loans", href: "/business/lending" },
          { label: "Business Line of Credit", href: "/business/lending" },
          { label: "Business Credit Cards", href: "/business/lending" },
        ]},
        { title: "Business Services", href: "/business/services", links: [
          { label: "Business Bill Pay", href: "/business/services" },
          { label: "Cash Management", href: "/business/services" },
          { label: "Merchant Services", href: "/business/services" },
          { label: "HSAs", href: "/business/services" },
          { label: "Contact Us", href: "/contact-us" },
        ]},
      ],
    ],
    featured: {
      image: navBusiness,
      title: "Online Banking For Businesses",
      body: "Log in to manage your business accounts 24/7.",
      href: "/business/services",
    },
  },
  {
    label: "Who We Are",
    href: "/who-we-are",
    rows: [
      [
        { title: "Community Support", href: "/who-we-are/community", links: [
          { label: "A+ Gives", href: "/who-we-are/community" },
          { label: "Member Giveback", href: "/who-we-are/community" },
          { label: "Member Support", href: "/who-we-are/community" },
          { label: "Scholarships", href: "/who-we-are/community" },
        ]},
        { title: "Youth Programs", href: "/who-we-are/community", links: [
          { label: "Scouting America", href: "/who-we-are/community" },
          { label: "Girl Scouts", href: "/who-we-are/community" },
          { label: "Youth Month", href: "/who-we-are/community" },
          { label: "Youth Financial Camp", href: "/who-we-are/community" },
          { label: "Financial Boot Camp", href: "/who-we-are/community" },
          { label: "Summer Saving Program", href: "/who-we-are/community" },
        ]},
        { title: "Educators", href: "/who-we-are/community", links: [
          { label: "Educator Loans", href: "/who-we-are/community" },
          { label: "Educator Resources", href: "/who-we-are/community" },
          { label: "A+ Education Foundation", href: "/who-we-are/community" },
        ]},
        { title: "Member Benefits", href: "/who-we-are/membership", links: [
          { label: "Refer & Earn", href: "/who-we-are/membership" },
          { label: "PlusPoints", href: "/who-we-are/membership" },
          { label: "Member Discounts", href: "/who-we-are/membership" },
          { label: "Golden Apple Club", href: "/who-we-are/membership" },
          { label: "Select Employee Groups", href: "/who-we-are/membership" },
        ]},
      ],
      [
        { title: "Contact Us", href: "/contact-us", links: [
          { label: "Contact", href: "/contact-us" },
          { label: "Request An Appointment", href: "/contact-us" },
        ]},
        { title: "Careers", href: "/who-we-are/about", links: [
          { label: "Careers", href: "/who-we-are/about" },
          { label: "Current Openings", href: "/who-we-are/about" },
        ]},
        { title: "Recognition & Awards", href: "/who-we-are/about", links: [
          { label: "Recognition & Awards", href: "/who-we-are/about" },
        ]},
        { title: "News & Publications", href: "/who-we-are/about", links: [
          { label: "News & Publications", href: "/who-we-are/about" },
        ]},
      ],
    ],
    featured: {
      image: navWho,
      title: "Join A+FCU!",
      body: "Open your account online within 5 minutes.",
      href: "/join",
    },
  },
  {
    label: "Guidance",
    href: "/guidance",
    rows: [
      [
        { title: "Life Guidance", href: "/guidance/financial-education", links: [
          { label: "Business Finances", href: "/guidance/financial-education" },
          { label: "Buying A Home", href: "/guidance/financial-education" },
          { label: "Buying A Vehicle", href: "/guidance/financial-education" },
          { label: "Family & Finances", href: "/guidance/financial-education" },
          { label: "Paying For College", href: "/guidance/financial-education" },
          { label: "Personal Finances", href: "/guidance/financial-education" },
          { label: "Retirement", href: "/guidance/financial-education" },
          { label: "Safety & Security", href: "/guidance/financial-education" },
        ]},
        { title: "Blog", href: "/guidance/financial-education", links: [
          { label: "A+ News", href: "/guidance/financial-education" },
          { label: "Business Finances", href: "/guidance/financial-education" },
          { label: "Buying A Home", href: "/guidance/financial-education" },
          { label: "Buying A Vehicle", href: "/guidance/financial-education" },
          { label: "Credit & Debt", href: "/guidance/financial-education" },
          { label: "View All Categories", href: "/guidance/financial-education" },
        ]},
        { title: "Calculators", href: "/guidance/tools", links: [
          { label: "Savings", href: "/guidance/tools" },
          { label: "Home Loans", href: "/guidance/tools" },
          { label: "Investments", href: "/guidance/tools" },
          { label: "Credit & Debt", href: "/guidance/tools" },
          { label: "Vehicle Loans", href: "/guidance/tools" },
        ]},
        { title: "BALANCE", href: "/guidance/financial-education", links: [
          { label: "Financial Counseling", href: "/guidance/financial-education" },
          { label: "BalanceTrack", href: "/guidance/financial-education" },
          { label: "Contests", href: "/guidance/financial-education" },
        ]},
      ],
      [
        { title: "", href: "", links: [] },
        { title: "Webinars & Events", href: "/guidance/financial-education", links: [
          { label: "Webinars & Events", href: "/guidance/financial-education" },
        ]},
        { title: "Rates", href: "/guidance/rates", links: [
          { label: "Savings Rates", href: "/guidance/rates" },
          { label: "Certificate Rates", href: "/guidance/rates" },
          { label: "Vehicle Loan Rates", href: "/guidance/rates" },
        ]},
        { title: "", href: "", links: [] },
      ],
    ],
    featured: {
      image: navGuidance,
      title: "Help Detect Fraud",
      body: "Monitor your credit with FREE monthly credit score updates – enroll today!*",
      href: "/services/online-banking",
    },
  },
];

type HeroBg = "yellow" | "white";
export const HERO_SLIDES: Array<{
  eyebrow: string | null;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  alt: string;
  bg: HeroBg;
}> = [
  {
    eyebrow: null,
    title: "Enjoy our limited-time mortgage offer.",
    body: "Close on your new home by September 30 to get a $500 lender credit!*",
    ctaLabel: "Get Details",
    ctaHref: "/loans",
    image: "https://aplusfcu.org/wp-content/uploads/global/img/q2-mortgage-purchase_may26_homepage-hero.webp",
    alt: "Family of four in the backyard while the dad helps the younger son ride a bike. Mom and sister clap in the back.",
    bg: "white",
  },
  {
    eyebrow: null,
    title: "A+ Personal Loan rates as low as 9.49% APR.*",
    body: "Big summer plans? Apply for a personal loan today, get funds by tomorrow.†",
    ctaLabel: "Apply Online",
    ctaHref: "/loans",
    image: "https://aplusfcu.org/wp-content/uploads/global/img/q2-personal-loan_may26_homepage-hero.webp",
    alt: "Man and woman sit at kitchen table with laptop and mobile phone.",
    bg: "white",
  },
  {
    eyebrow: null,
    title: "Over $25 million earned in cash back!*",
    body: "Join the cash-back movement by using your A+FCU debit card for everyday purchases.",
    ctaLabel: "Here's How",
    ctaHref: "/accounts",
    image: "https://aplusfcu.org/wp-content/uploads/global/img/q2-checking-accounts_may26_homepage-hero_v1-1400x950.webp",
    alt: "Image of mobile phone with the A+ Mobile App showing cash back earned. A+ debit card is in front of the phone.",
    bg: "white",
  },
];

export const RATES = [
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-loans.svg",
    name: "Mortgage Purchase",
    term: "30-Year Fixed",
    primary: "5.990%",
    primaryLabel: "As Low As APR",
    secondary: "6.042% APR",
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_vehicle-loans.svg",
    name: "Auto Purchase",
    term: "6-36 Months",
    primary: "5.49%",
    primaryLabel: "As Low As APR",
    secondary: "APR",
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_personal-finances.svg",
    name: "Share Certificate",
    term: "18-Month Term",
    primary: "3.55%",
    primaryLabel: "",
    secondary: "APY",
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-equity.svg",
    name: "Home Equity Loan",
    term: "5-Year Home Equity",
    primary: "5.240%",
    primaryLabel: "As Low As APR",
    secondary: "5.500% APR",
  },
  {
    icon: "https://aplusfcu.org/wp-content/uploads/global/icons/color/icon_home-refinance.svg",
    name: "Mortgage Refi",
    term: "15-Year Fixed",
    primary: "5.625%",
    primaryLabel: "As Low As APR",
    secondary: "5.709% APR",
  },
];

export const AWARDS = [
  "https://aplusfcu.org/wp-content/uploads/global/img/logo-grid-image_2025-cca-winner-badge_sep25.jpg",
  "https://aplusfcu.org/wp-content/uploads/global/img/logo-grid-image_2025-top-workplaces-badge_nov25.webp",
  "https://aplusfcu.org/wp-content/uploads/global/img/logo-grid-image_2025-austin-gives-winner-badge_sep25.webp",
  "https://aplusfcu.org/wp-content/uploads/global/img/logo-grid-image_2025-global-finance-best-mobile-app-award_sep25.webp",
  "https://aplusfcu.org/wp-content/uploads/landing-pages/img/logo-grid-image_2024-communitys-choice-awards-badge_sep24.jpg",
  "https://aplusfcu.org/wp-content/uploads/global/img/logo-grid-image_2025-top-workplaces-badge_jan25.png",
  "https://aplusfcu.org/wp-content/uploads/landing-pages/img/logo-grid-image-a-awards-landing-page_2023-best-of-the-best_nov23.jpg",
  "https://aplusfcu.org/wp-content/uploads/landing-pages/img/logo-grid-image-a-awards-landing-page_2023-top-workplace_nov23.jpg",
  "https://aplusfcu.org/wp-content/uploads/landing-pages/img/logo-grid-image-a-awards-landing-page_austin-gives-generous-business_nov23.jpg",
  "https://aplusfcu.org/wp-content/uploads/landing-pages/img/logo-grid-image-a-awards-landing-page_dora-maxwell-social-responsibility_nov23.jpg",
];

export const ARTICLES = [
  {
    title: "What To Avoid During The Mortgage Process: 9 Common Mistakes",
    excerpt: "Avoid these 9 common mistakes buyers make during the mortgage process to help ensure your application stays on course for a successful closing.",
    image: "https://aplusfcu.org/wp-content/uploads/blog/img/9-things-to-avoid-mortgage_blog.jpg",
  },
  {
    title: "16 Months Of Financial Tips",
    excerpt: "Use these monthly financial tips to break down your top financial tasks and to-dos and get on the right path to being financially healthy.",
    image: "https://aplusfcu.org/wp-content/uploads/blog/img/planner_blog.jpg",
  },
  {
    title: "Want To Teach Your Kids About Money? Start With These 6 Simple Lessons",
    excerpt: "Help your kids build smart money habits early with practical tips on saving, spending, and financial responsibility.",
    image: "https://aplusfcu.org/wp-content/uploads/blog/img/6-powerful-money-lessons-for-little-kids_may18_blog.jpg",
  },
];

export const ANGLE_OVERLAY =
  "https://aplusfcu.org/wp-content/themes/aplusfcu/images/dist/angle_hero-homepage.png";

export const LOGO_ALT = "A+ Federal Credit Union";
