import { ArrowRight } from "lucide-react";

export function OnlineBankingLogin() {
  return (
    <section id="login" className="relative -mt-10 lg:-mt-16 z-30">
      <div className="container-x">
        <div className="bg-white shadow-2xl border border-border p-6 md:p-8 max-w-2xl">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="font-serif text-2xl md:text-3xl">A+ Online Banking</h2>
            <a href="/join" className="text-brand-green underline underline-offset-4 font-semibold text-sm hover:no-underline whitespace-nowrap">
              Become a Member
            </a>
          </div>
          <form className="grid sm:grid-cols-[1fr_1fr_auto] gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="text-sm">
              <span className="block mb-1 text-ink/80">Login ID (required)</span>
              <input className="w-full border border-border px-3 py-2.5 outline-none focus:border-brand-green" />
            </label>
            <label className="text-sm">
              <span className="block mb-1 text-ink/80">Password (required)</span>
              <input type="password" className="w-full border border-border px-3 py-2.5 outline-none focus:border-brand-green" />
            </label>
            <button
              type="submit"
              className="self-end bg-brand-green hover:bg-brand-green-dark text-white px-6 py-2.5 font-semibold inline-flex items-center gap-2"
            >
              Log In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {["Enroll in Online Banking", "Forgot ID?", "Forgot Password?", "Unlock Account"].map((l) => (
              <a key={l} href="#" className="text-brand-green underline underline-offset-4 hover:no-underline">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}