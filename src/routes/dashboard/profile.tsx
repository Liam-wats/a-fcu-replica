import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, User, Settings, Loader2, AlertCircle,
  CheckCircle2, Eye, EyeOff, Phone, Mail, MapPin, Lock,
} from "lucide-react";
import type { Session } from "@/routes/dashboard";
import { ACCOUNT_LABELS } from "@/routes/dashboard";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function getToken() {
  return sessionStorage.getItem("apfcu_token") || "";
}

interface Profile {
  firstName: string; lastName: string;
  email: string; phone: string;
  street: string; apt: string;
  city: string; state: string; zip: string;
}

type Tab = "contact" | "security";

function ProfilePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("contact");

  // Contact info state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile>({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", apt: "", city: "", state: "", zip: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("apfcu_session");
    if (!raw) return;
    const s: Session = JSON.parse(raw);
    setSession(s);
    fetch(`/api/member/${s.loginId}/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(data => {
        setProfile(data);
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          street: data.street ?? "",
          apt: data.apt ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          zip: data.zip ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const set = (field: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setContactError("");
    setContactSuccess(false);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setContactError("");
    setContactSuccess(false);
    setSavingContact(true);
    try {
      const res = await fetch(`/api/member/${session.loginId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setContactError(data.error || "Failed to save changes.");
      // Update session storage so the header reflects the new name/email
      const updated = {
        ...session,
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        email: data.profile.email,
      };
      sessionStorage.setItem("apfcu_session", JSON.stringify(updated));
      setSession(updated);
      setProfile(p => ({ ...p!, ...data.profile }));
      setContactSuccess(true);
    } catch {
      setContactError("Failed to save changes. Please try again.");
    } finally {
      setSavingContact(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setPasswordError("");
    setPasswordSuccess(false);
    if (newPassword.length < 8) return setPasswordError("New password must be at least 8 characters.");
    if (newPassword !== confirmPassword) return setPasswordError("Passwords do not match.");
    setSavingPassword(true);
    try {
      const res = await fetch(`/api/member/${session.loginId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setPasswordError(data.error || "Failed to change password.");
      setPasswordSuccess(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!session) return null;
  const accountLabel = ACCOUNT_LABELS[session.accountType] ?? session.accountType;

  return (
    <div className="container-x py-8 max-w-2xl">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] text-brand-green hover:underline underline-offset-4 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      <div className="bg-white border border-border shadow-sm">
        <div className="h-1 bg-brand-green" />

        {/* Header */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-brand-green" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Online Banking</span>
          </div>
          <h1 className="font-serif text-2xl text-ink">My Profile</h1>
          <p className="text-[13px] text-ink/50 mt-1">{accountLabel} · {session.loginId}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {([
            { key: "contact", label: "Contact Info", icon: Mail },
            { key: "security", label: "Account Settings", icon: Settings },
          ] as { key: Tab; label: string; icon: typeof Mail }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3.5 text-[13px] font-semibold border-b-2 transition-colors ${
                tab === key
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-ink/50 hover:text-ink hover:border-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* ── CONTACT INFO TAB ── */}
        {tab === "contact" && (
          <div className="px-8 py-6">
            {loadingProfile ? (
              <div className="flex items-center justify-center py-12 gap-2 text-ink/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : (
              <form onSubmit={handleSaveContact} className="space-y-5">
                {contactSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2 text-[13px] text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Your contact information has been updated successfully.
                  </div>
                )}
                {contactError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {contactError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-3 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Personal Info
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-ink mb-1.5">First Name</label>
                      <input
                        type="text" required
                        className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                        value={form.firstName} onChange={set("firstName")}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-ink mb-1.5">Last Name</label>
                      <input
                        type="text" required
                        className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                        value={form.lastName} onChange={set("lastName")}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-3 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Contact Details
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-ink mb-1.5">Email Address</label>
                      <input
                        type="email" required
                        className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                        value={form.email} onChange={set("email")}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-ink mb-1.5">Phone Number</label>
                      <input
                        type="tel" required
                        className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                        value={form.phone} onChange={set("phone")}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> Mailing Address
                  </p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[12px] font-semibold text-ink mb-1.5">Street Address</label>
                        <input
                          type="text"
                          className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                          value={form.street} onChange={set("street")}
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-ink mb-1.5">Apt / Unit</label>
                        <input
                          type="text"
                          className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                          value={form.apt} onChange={set("apt")}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[12px] font-semibold text-ink mb-1.5">City</label>
                        <input
                          type="text"
                          className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                          value={form.city} onChange={set("city")}
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-ink mb-1.5">State</label>
                        <input
                          type="text" maxLength={2}
                          className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all uppercase"
                          value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase() }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[12px] font-semibold text-ink mb-1.5">ZIP Code</label>
                        <input
                          type="text" maxLength={10}
                          className="w-full border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                          value={form.zip} onChange={set("zip")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingContact}
                    className="bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white px-8 py-3 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                  >
                    {savingContact
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                      : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ── ACCOUNT SETTINGS TAB ── */}
        {tab === "security" && (
          <div className="px-8 py-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-brand-green" />
                <p className="text-[13px] font-bold text-ink">Change Password</p>
              </div>
              <p className="text-[12px] text-ink/50">Your password must be at least 8 characters long.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
              {passwordSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2 text-[13px] text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Password changed successfully.
                </div>
              )}
              {passwordError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-[13px] px-4 py-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {passwordError}
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-ink mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    className="w-full border border-border bg-white px-3 py-2.5 pr-10 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                    value={currentPassword}
                    onChange={e => { setCurrentPassword(e.target.value); setPasswordError(""); setPasswordSuccess(false); }}
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required minLength={8}
                    className="w-full border border-border bg-white px-3 py-2.5 pr-10 text-sm text-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setPasswordError(""); setPasswordSuccess(false); }}
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    className={`w-full border bg-white px-3 py-2.5 pr-10 text-sm text-ink outline-none focus:ring-2 transition-all ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-border focus:border-brand-green focus:ring-brand-green/10"
                    }`}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setPasswordError(""); setPasswordSuccess(false); }}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-[11px] text-red-500 mt-1">Passwords do not match.</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white px-8 py-3 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  {savingPassword
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                    : <><Lock className="w-4 h-4" /> Update Password</>
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
