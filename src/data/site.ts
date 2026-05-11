export const NAV = [
  {
    label: "Accounts",
    href: "/accounts",
    columns: [
      { title: "Checking", href: "/accounts/checking", links: [
        { label: "Cash-Back Checking", href: "/accounts/checking" },
        { label: "Free Checking", href: "/accounts/checking" },
        { label: "Compare Checking", href: "/accounts/checking#compare" },
      ]},
      { title: "Savings", href: "/accounts/savings", links: [
        { label: "Regular Savings", href: "/accounts/savings" },
        { label: "Money Market", href: "/accounts/savings" },
        { label: "Holiday & Vacation Club", href: "/accounts/savings" },
      ]},
      { title: "Certificates", href: "/accounts/certificates", links: [
        { label: "Share Certificates", href: "/accounts/certificates" },
        { label: "IRA Certificates", href: "/accounts/certificates" },
        { label: "Compare Certificates", href: "/accounts/certificates#compare" },
      ]},
      { title: "Youth", href: "/accounts/youth", links: [
        { label: "Kids Accounts (0–12)", href: "/accounts/youth" },
        { label: "Teen Accounts (13–17)", href: "/accounts/youth" },
        { label: "Student Accounts", href: "/accounts/youth" },
      ]},
    ],
  },
  {
    label: "Loans",
    href: "/loans",
    columns: [
      { title: "Home Loans", href: "/loans/home-loans", links: [
        { label: "Mortgage Purchase", href: "/loans/home-loans" },
        { label: "Mortgage Refinance", href: "/loans/home-loans" },
        { label: "Home Equity", href: "/loans/home-loans" },
        { label: "HELOC", href: "/loans/home-loans" },
      ]},
      { title: "Vehicle Loans", href: "/loans/vehicle-loans", links: [
        { label: "Auto Purchase", href: "/loans/vehicle-loans" },
        { label: "Auto Refinance", href: "/loans/vehicle-loans" },
        { label: "RV & Boat", href: "/loans/vehicle-loans" },
        { label: "Motorcycle", href: "/loans/vehicle-loans" },
      ]},
      { title: "Personal Credit", href: "/loans/personal-credit", links: [
        { label: "Personal Loans", href: "/loans/personal-credit" },
        { label: "Credit Cards", href: "/loans/personal-credit" },
        { label: "Lines of Credit", href: "/loans/personal-credit" },
      ]},
      { title: "Student Loans", href: "/loans/student-loans", links: [
        { label: "Private Student Loans", href: "/loans/student-loans" },
        { label: "Refinance Student Loans", href: "/loans/student-loans" },
      ]},
    ],
  },
  {
    label: "Services",
    href: "/services",
    columns: [
      { title: "Online Banking", links: ["A+ Online Banking", "Bill Pay", "Card Management", "Credit Score"] },
      { title: "Mobile Banking", links: ["A+ Mobile App", "Mobile Deposit", "Digital Wallets"] },
      { title: "Member Services", links: ["Direct Deposit", "Wire Transfers", "Notary"] },
      { title: "Insurance & Investments", links: ["Insurance", "Investments", "Retirement"] },
    ],
  },
  {
    label: "Business",
    href: "/business",
    columns: [
      { title: "Business Accounts", links: ["Checking", "Savings", "Certificates"] },
      { title: "Business Lending", links: ["Loans", "Lines of Credit", "Commercial Real Estate"] },
      { title: "Business Services", links: ["Online Banking", "Merchant Services", "Payroll"] },
    ],
  },
  {
    label: "Who We Are",
    href: "/who-we-are",
    columns: [
      { title: "About", links: ["Our Story", "Leadership", "Careers", "Newsroom"] },
      { title: "Community", links: ["A+ Gives", "Sponsorships", "Volunteering"] },
      { title: "Membership", links: ["Join A+FCU", "Member Benefits", "Refer a Friend"] },
    ],
  },
  {
    label: "Guidance",
    href: "/guidance",
    columns: [
      { title: "Financial Education", links: ["Workshops", "Calculators", "Articles"] },
      { title: "Rates", links: ["All Rates", "Loan Rates", "Deposit Rates"] },
      { title: "Tools", links: ["Make a Payment", "Switch Kit", "FAQ"] },
    ],
  },
] as const;

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