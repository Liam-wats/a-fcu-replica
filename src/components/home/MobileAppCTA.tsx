export function MobileAppCTA() {
  return (
    <section className="container-x mt-14 mb-4 flex flex-col md:flex-row md:items-center gap-6 justify-between">
      <h2 className="font-serif text-2xl md:text-3xl">Download The A+ Mobile App</h2>
      <div className="flex gap-3">
        <a href="#" aria-label="Download on the App Store" className="block">
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="Download on the App Store"
            className="h-12"
          />
        </a>
        <a href="#" aria-label="Get it on Google Play" className="block">
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            className="h-12"
          />
        </a>
      </div>
    </section>
  );
}