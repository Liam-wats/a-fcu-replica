import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function OnlineBankingLogin() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginId.trim() || !password.trim()) {
      setError("Please enter your Login ID and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("apfcu_session", JSON.stringify(data.member));
        navigate({ to: "/" });
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login" className="relative -mt-10 lg:-mt-16 z-30 mx-0 px-6 lg:px-10">
      <div className="bg-white shadow-2xl border border-border p-6 md:p-8 max-w-2xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="font-serif text-2xl md:text-3xl">A+ Online Banking</h2>
          <a href="/join" className="text-brand-green underline underline-offset-4 font-semibold text-sm hover:no-underline whitespace-nowrap">
            Become a Member
          </a>
        </div>

        {error && (
          <div className="mb-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-xs px-3 py-2 leading-relaxed">
            {error}
          </div>
        )}

        <form className="grid sm:grid-cols-[1fr_1fr_auto] gap-3" onSubmit={handleSubmit}>
          <label className="text-sm">
            <span className="block mb-1 text-ink/80">Login ID (required)</span>
            <input
              autoComplete="username"
              className="w-full border border-border px-3 py-2.5 outline-none focus:border-brand-green text-sm"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="block mb-1 text-ink/80">Password (required)</span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                className="w-full border border-border px-3 py-2.5 pr-9 outline-none focus:border-brand-green text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink"
                aria-label={showPw ? "Hide" : "Show"}
              >
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="self-end bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white px-6 py-2.5 font-semibold inline-flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <>Log In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {["Enroll in Online Banking", "Forgot ID?", "Forgot Password?", "Unlock Account"].map((l) => (
            <a key={l} href="#" className="text-brand-green underline underline-offset-4 hover:no-underline">{l}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
