import { createFileRoute } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { OnlineBankingLogin } from "@/components/home/OnlineBankingLogin";
import { FeaturedRates } from "@/components/home/FeaturedRates";
import { ContentBlock } from "@/components/home/ContentBlock";
import { PillLinks } from "@/components/home/PillLinks";
import { AwardsGrid } from "@/components/home/AwardsGrid";
import { CategoryCards } from "@/components/home/CategoryCards";
import { LatestArticles } from "@/components/home/LatestArticles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A+ Federal Credit Union" },
      { name: "description", content: "Banking on each other. Building stronger communities. Personal and business banking, loans, mortgages, and more." },
      { property: "og:title", content: "A+ Federal Credit Union" },
      { property: "og:description", content: "Banking on each other. Building stronger communities." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroCarousel />
      <OnlineBankingLogin />
      <FeaturedRates />
      <ContentBlock
        image="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_online-services_feb26.webp"
        imageAlt="Person using A+ mobile banking app on phone"
        icon="https://aplusfcu.org/wp-content/uploads/global/icons/gray/icon_gray_mobile-banking.svg"
        eyebrow="Online Services"
        title="Convenient Online Tools To Help You Live Your A+ Life"
        body="Get the most out of your A+FCU membership with free services designed to benefit you. Get paid up to two days early† with direct deposit, use Card Management to add extra security and set controls for your A+FCU debit cards, and stay on top of your credit with monthly credit score updates through A+ Online Banking and the award-winning A+ Mobile App, recognized as the 2025 Best Mobile Banking App in North America."
        links={[
          { label: "Direct Deposit", href: "/services" },
          { label: "Manage Your Cards", href: "/services" },
          { label: "Credit Score", href: "/services" },
        ]}
      />
      <PillLinks />
      <ContentBlock
        flip
        bg="cream"
        image="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_about-afcu_feb26.webp"
        imageAlt="A+FCU team members making heart shapes with their hands."
        icon="https://aplusfcu.org/wp-content/uploads/global/icons/gray/icon_gray_about.svg"
        eyebrow="About A+FCU"
        title="Banking on each other. Building stronger communities.®"
        body="At A+FCU, we don't have customers, we have members. That means we're all in this together, and when one member does well, we all share the benefits."
        links={[
          { label: "Who We Are", href: "/who-we-are" },
          { label: "Community Support", href: "/who-we-are" },
          { label: "Join Now", href: "/accounts" },
        ]}
      />
      <AwardsGrid />
      <ContentBlock
        image="https://aplusfcu.org/wp-content/uploads/global/img/alt-content-block-image_a-loans_sep24.png"
        imageAlt="A young man and young woman sitting on a porch talking."
        icon="https://aplusfcu.org/wp-content/uploads/global/icons/gray/icon_gray_loans.svg"
        eyebrow="A+FCU Loans"
        title="We'll set you up with the right loan for your needs."
        body="Depending on your wants, needs, and financial situation, we'll work together to find the loan that's best for you."
        links={[
          { label: "Home Loans", href: "/loans" },
          { label: "Vehicle Loans", href: "/loans" },
          { label: "Personal Loans", href: "/loans" },
        ]}
      />
      <CategoryCards />
      <LatestArticles />
    </>
  );
}
