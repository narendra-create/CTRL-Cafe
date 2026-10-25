"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { bookings, profiles } from "@/src/db/schema";
import {
  formatToNormalDate,
  formatToNormalTime,
  getInitials,
} from "@/lib/utils/tools";
import { toast } from "@/components/ui/toast";

const GOAL = 65;

/* Section: Types */
type Props = {
  email: string;
  providers: string[];
  bookingHistory: Array<typeof bookings.$inferSelect>;
  userDetails: typeof profiles.$inferSelect;
};

/* Section: Sub-components */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-[800] tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1.5 text-[11px] font-[800] tracking-[0.05em] text-[#434943] dark:text-[#c5c4bb] uppercase"
    >
      {children}
    </label>
  );
}

function TextInput({
  id,
  type = "text",
  value,
  onChange,
  readOnly,
  placeholder,
  autoComplete,
  disabled,
}: {
  id: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      readOnly={readOnly}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-accent dark:focus:border-accent focus:shadow-[0_0_0_3px_rgba(250,204,21,0.13)] placeholder:text-[#a09d94] dark:placeholder:text-[#70746d] disabled:opacity-50 read-only:opacity-60 read-only:cursor-default"
    />
  );
}

function ProviderBadge({
  connected,
  name,
}: {
  connected: boolean;
  name: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-[700] ${
        connected
          ? "bg-accent/20 text-accent-foreground dark:bg-accent/15 dark:text-accent border border-accent/30"
          : "bg-muted text-muted-foreground border border-border"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${connected ? "bg-accent" : "bg-muted-foreground/40"}`}
      />
      {name}
    </span>
  );
}

/* Section: Main Component */
export default function SettingsClient({
  email,
  providers,
  bookingHistory,
  userDetails,
}: Props) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    "profile" | "account" | "rewards" | "history" | "membership"
  >("profile");

  /* Section: Profile State */
  const [name, setName] = useState(userDetails.fullName ?? "");
  const [phone, setPhone] = useState(userDetails.phone ?? "");
  const [gender, setGender] = useState<string>(userDetails.gender ?? "male");
  const [dob, setDob] = useState<string>(
    userDetails.dateOfBirth ? String(userDetails.dateOfBirth).split("T")[0] : ""
  );
  const [avatarUrl] = useState<string | null>(userDetails.avatarUrl);
  const [profileStatus, setProfileStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  /* Section: Account State */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [pwError, setPwError] = useState<string | null>(null);

  /* Section: Rewards Math */
  const pts = userDetails.rewardPoints ?? 0;
  const pct = Math.min((pts / GOAL) * 100, 100);
  const left = Math.max(GOAL - pts, 0);

  /* Section: Handlers */
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileStatus("saving");
    try {
      setProfileStatus("saved");
      toast.add({
        type: "success",
        title: "Profile saved",
        description: "Your profile details have been updated.",
      });
      setTimeout(() => setProfileStatus("idle"), 3000);
    } catch (err: any) {
      setProfileStatus("error");
      const errorMsg = err?.message || "Failed to update profile.";
      toast.add({
        type: "error",
        title: "Error",
        description: errorMsg,
      });
    }
  }

  async function handleSignOut() {
    setSignOutLoading(true);
    try {
      router.push("/auth/login");
    } catch (err: any) {
      setSignOutLoading(false);
      const errorMsg = err?.message || "Failed to sign out.";
      toast.add({
        type: "error",
        title: "Sign out failed",
        description: errorMsg,
      });
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      setShowDeleteConfirm(false);
      setDeleteLoading(false);
      toast.add({
        type: "info",
        title: "Delete account",
        description: "Account deletion to be handled by controller.",
      });
    } catch (err: any) {
      setDeleteLoading(false);
      const errorMsg = err?.message || "Failed to delete account.";
      toast.add({
        type: "error",
        title: "Error",
        description: errorMsg,
      });
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    if (pwForm.next !== pwForm.confirm) {
      const msg = "New passwords don't match.";
      setPwError(msg);
      toast.add({
        type: "error",
        title: "Password error",
        description: msg,
      });
      return;
    }
    if (pwForm.next.length < 8) {
      const msg = "Password must be at least 8 characters.";
      setPwError(msg);
      toast.add({
        type: "error",
        title: "Password error",
        description: msg,
      });
      return;
    }
    setPwStatus("saving");
    try {
      setPwStatus("saved");
      toast.add({
        type: "success",
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwStatus("idle"), 3500);
    } catch (err: any) {
      setPwStatus("error");
      const msg = err?.message || "Could not update password.";
      setPwError(msg);
      toast.add({
        type: "error",
        title: "Update failed",
        description: msg,
      });
    }
  }

  const isGoogle = providers.includes("google");
  const isDiscord = providers.includes("discord");
  const hasPassword = !providers.length || providers.includes("email");
  const initials = getInitials(name || userDetails.fullName || email);

  const navItems = [
    { id: "profile" as const, label: "Profile", icon: ProfileIcon },
    { id: "account" as const, label: "Account", icon: AccountIcon },
    { id: "rewards" as const, label: "Rewards", icon: RewardsIcon },
    { id: "history" as const, label: "Booking History", icon: HistoryIcon },
    { id: "membership" as const, label: "Membership", icon: MembershipIcon },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-[1080px] mx-auto">
        {/* Section: Page Header */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-[28px] md:text-[34px] font-[800] tracking-[-0.05em] leading-tight">
            Settings
          </h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            Manage your profile, account, and preferences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
          {/* Section: Sidebar Navigation */}
          <nav className="w-full md:w-52 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 md:sticky md:top-28">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-[700] text-left whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon active={active} />
                  <span className="hidden md:block">{label}</span>
                  <span className="md:hidden text-[12px]">{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Section: Content Area */}
          <div className="flex-1 min-w-0">
            {/* Section: Profile */}
            {activeSection === "profile" && (
              <div className="rounded-[16px] border border-border bg-background p-6 md:p-8 shadow-sm">
                <SectionLabel>Profile</SectionLabel>
                <h2 className="text-[20px] font-[800] tracking-tight mb-1">
                  Your public profile
                </h2>
                <p className="text-[13px] text-muted-foreground mb-8">
                  This is how staff confirm your booking at the counter.
                </p>

                {/* Section: Avatar */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                  <div className="size-[68px] rounded-full overflow-hidden bg-accent flex items-center justify-center shrink-0 border-2 border-border">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={initials}
                        width={68}
                        height={68}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-[22px] font-[800] text-accent-foreground">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-[700]">{name || email}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {email}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="mt-2 text-[12px] font-[700] text-accent-foreground dark:text-accent underline underline-offset-2 cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      Change photo
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Section: Profile Form */}
                <form onSubmit={handleSaveProfile} className="grid gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel htmlFor="name">Full name</FieldLabel>
                      <TextInput
                        id="name"
                        value={name}
                        onChange={setName}
                        placeholder="Your name"
                        autoComplete="name"
                        disabled={profileStatus === "saving"}
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                      <TextInput
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+91 00000 00000"
                        autoComplete="tel"
                        disabled={profileStatus === "saving"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={profileStatus === "saving"}
                        className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-accent dark:focus:border-accent focus:shadow-[0_0_0_3px_rgba(250,204,21,0.13)] disabled:opacity-50"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
                      <TextInput
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={setDob}
                        disabled={profileStatus === "saving"}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <TextInput id="email" type="email" value={email} readOnly />
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Verified. Used for sign-in codes and booking confirmations.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={profileStatus === "saving"}
                      className="rounded-[10px] px-5 py-2.5 bg-[#202b29] dark:bg-accent text-white dark:text-accent-foreground text-[13px] font-[800] cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {profileStatus === "saving" ? "Saving…" : "Save changes"}
                    </button>
                    {profileStatus === "saved" && (
                      <span className="text-[13px] font-[600] text-green-600 dark:text-green-400">
                        ✓ Saved
                      </span>
                    )}
                    {profileStatus === "error" && (
                      <span className="text-[13px] font-[600] text-destructive">
                        Something went wrong.
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Section: Account */}
            {activeSection === "account" && (
              <div className="grid gap-5">
                {/* Section: Connected Accounts */}
                <div className="rounded-[16px] border border-border bg-background p-6 md:p-7 shadow-sm">
                  <SectionLabel>Connections</SectionLabel>
                  <h2 className="text-[18px] font-[800] tracking-tight mb-1">
                    Connected accounts
                  </h2>
                  <p className="text-[13px] text-muted-foreground mb-6">
                    Sign in faster using an account you already use.
                  </p>

                  <div className="grid gap-3">
                    {/* Google Row */}
                    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-[8px] border border-border bg-muted flex items-center justify-center shrink-0">
                          <GoogleIcon />
                        </div>
                        <div>
                          <p className="text-[13px] font-[700]">Google</p>
                          <ProviderBadge
                            connected={isGoogle}
                            name={isGoogle ? "Connected" : "Not connected"}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          toast.add({
                            type: "info",
                            title: "Google connection",
                            description: "OAuth handling will be wired with controller.",
                          })
                        }
                        className="text-[12px] font-[700] px-3.5 py-1.5 rounded-[8px] border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer"
                      >
                        {isGoogle ? "Disconnect" : "Connect"}
                      </button>
                    </div>

                    {/* Discord Row */}
                    <div className="flex items-center justify-between gap-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-[8px] border border-border bg-muted flex items-center justify-center shrink-0">
                          <DiscordIcon />
                        </div>
                        <div>
                          <p className="text-[13px] font-[700]">Discord</p>
                          <ProviderBadge
                            connected={isDiscord}
                            name={isDiscord ? "Connected" : "Not connected"}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          toast.add({
                            type: "info",
                            title: "Discord connection",
                            description: "OAuth handling will be wired with controller.",
                          })
                        }
                        className="text-[12px] font-[700] px-3.5 py-1.5 rounded-[8px] border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer"
                      >
                        {isDiscord ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section: Password */}
                {hasPassword && (
                  <div className="rounded-[16px] border border-border bg-background p-6 md:p-7 shadow-sm">
                    <SectionLabel>Security</SectionLabel>
                    <h2 className="text-[18px] font-[800] tracking-tight mb-1">
                      Change password
                    </h2>
                    <p className="text-[13px] text-muted-foreground mb-6">
                      Choose a strong password you don't use anywhere else.
                    </p>

                    <form
                      onSubmit={handleChangePassword}
                      className="grid gap-4"
                    >
                      {pwError && (
                        <div className="rounded-[10px] bg-destructive/10 border border-destructive/25 px-4 py-3 text-[12px] font-[600] text-destructive">
                          {pwError}
                        </div>
                      )}
                      <div>
                        <FieldLabel htmlFor="pw-current">
                          Current password
                        </FieldLabel>
                        <TextInput
                          id="pw-current"
                          type="password"
                          value={pwForm.current}
                          onChange={(v) =>
                            setPwForm((f) => ({ ...f, current: v }))
                          }
                          autoComplete="current-password"
                          disabled={pwStatus === "saving"}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <FieldLabel htmlFor="pw-new">New password</FieldLabel>
                          <TextInput
                            id="pw-new"
                            type="password"
                            value={pwForm.next}
                            onChange={(v) =>
                              setPwForm((f) => ({ ...f, next: v }))
                            }
                            autoComplete="new-password"
                            disabled={pwStatus === "saving"}
                          />
                        </div>
                        <div>
                          <FieldLabel htmlFor="pw-confirm">
                            Confirm new password
                          </FieldLabel>
                          <TextInput
                            id="pw-confirm"
                            type="password"
                            value={pwForm.confirm}
                            onChange={(v) =>
                              setPwForm((f) => ({ ...f, confirm: v }))
                            }
                            autoComplete="new-password"
                            disabled={pwStatus === "saving"}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <button
                          type="submit"
                          disabled={
                            pwStatus === "saving" ||
                            !pwForm.current ||
                            !pwForm.next
                          }
                          className="rounded-[10px] px-5 py-2.5 bg-[#202b29] dark:bg-accent text-white dark:text-accent-foreground text-[13px] font-[800] cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                          {pwStatus === "saving"
                            ? "Updating…"
                            : "Update password"}
                        </button>
                        {pwStatus === "saved" && (
                          <span className="text-[13px] font-[600] text-green-600 dark:text-green-400">
                            ✓ Password updated
                          </span>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* Section: Sign Out & Danger Zone */}
                <div className="rounded-[16px] border border-border bg-background p-6 md:p-7 shadow-sm">
                  <SectionLabel>Session</SectionLabel>
                  <h2 className="text-[18px] font-[800] tracking-tight mb-6">
                    Sign out
                  </h2>

                  <div className="flex items-center justify-between gap-4 py-3 border-b border-border">
                    <div>
                      <p className="text-[13px] font-[700]">Sign out</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        End your session on this device.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signOutLoading}
                      className="text-[12px] font-[700] px-3.5 py-1.5 rounded-[8px] border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {signOutLoading ? "Signing out…" : "Sign out"}
                    </button>
                  </div>

                  {/* Section: Danger Zone */}
                  <div className="mt-6 rounded-[12px] border border-destructive/20 bg-destructive/5 p-4 md:p-5">
                    <p className="text-[11px] font-[800] tracking-[0.12em] text-destructive uppercase mb-3">
                      Danger zone
                    </p>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-[700]">Delete account</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5 max-w-[32ch]">
                          Permanently removes your profile, points, and all
                          booking history. This cannot be undone.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="shrink-0 text-[12px] font-[700] px-3.5 py-1.5 rounded-[8px] border border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                      >
                        Delete account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section: Rewards */}
            {activeSection === "rewards" && (
              <div className="grid gap-5">
                <div className="rounded-[16px] border border-border bg-background p-6 md:p-8 shadow-sm">
                  <SectionLabel>CTRL Points</SectionLabel>
                  <h2 className="text-[20px] font-[800] tracking-tight mb-1">
                    Your rewards
                  </h2>
                  <p className="text-[13px] text-muted-foreground mb-8">
                    Every hour you book earns 10 points. Reach 65 and get a free
                    hour.
                  </p>

                  {/* Section: Points Display */}
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-[52px] font-[900] leading-none tracking-[-0.05em]">
                      {pts}
                    </span>
                    <div>
                      <span className="text-[15px] font-[700] text-muted-foreground">
                        / {GOAL} pts
                      </span>
                      {left > 0 && (
                        <p className="text-[12px] text-muted-foreground mt-0.5">
                          {left} more to a free hour
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section: Progress Bar */}
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={GOAL}
                    aria-valuenow={pts}
                    className="h-3 rounded-full bg-muted overflow-hidden mb-6"
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {pts >= GOAL && (
                    <div className="mb-6 rounded-[10px] bg-accent/20 border border-accent/30 px-4 py-3 text-[13px] font-[700] text-accent-foreground">
                      🎉 Free hour unlocked! Head to the Rewards page to redeem it.
                    </div>
                  )}

                  <Link
                    href="/Rewards"
                    className="inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 bg-[#202b29] dark:bg-accent text-white dark:text-accent-foreground text-[13px] font-[800] transition-all duration-150 hover:-translate-y-px hover:shadow-md cursor-pointer"
                  >
                    View full Rewards page
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {/* Section: How it works */}
                <div className="rounded-[16px] border border-border bg-muted/30 p-5 md:p-6">
                  <p className="text-[11px] font-[800] tracking-[0.12em] text-muted-foreground uppercase mb-3">
                    How it works
                  </p>
                  <div className="grid gap-3">
                    {[
                      {
                        step: "1",
                        text: "Book a gaming session — 10 pts added automatically.",
                      },
                      {
                        step: "2",
                        text: "Stack up to 65 points, roughly 7 hours of play.",
                      },
                      {
                        step: "3",
                        text: "Redeem for one free hour, no strings attached.",
                      },
                    ].map(({ step, text }) => (
                      <div key={step} className="flex items-start gap-3">
                        <span className="size-6 rounded-full bg-accent flex items-center justify-center text-[11px] font-[900] text-accent-foreground shrink-0">
                          {step}
                        </span>
                        <p className="text-[13px] text-muted-foreground pt-0.5">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section: Booking History */}
            {activeSection === "history" && (
              <div className="rounded-[16px] border border-border bg-background shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-border">
                  <SectionLabel>Activity</SectionLabel>
                  <h2 className="text-[20px] font-[800] tracking-tight mb-1">
                    Booking history
                  </h2>
                  <p className="text-[13px] text-muted-foreground">
                    Your past sessions and what you spent.
                  </p>
                </div>

                {bookingHistory.length === 0 ? (
                  <div className="p-8 md:p-12 flex flex-col items-center text-center">
                    <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-4">
                      <HistoryIcon active={false} size={24} />
                    </div>
                    <p className="text-[15px] font-[700] mb-1">
                      No bookings yet
                    </p>
                    <p className="text-[13px] text-muted-foreground max-w-[26ch]">
                      Your completed sessions will show up here.
                    </p>
                    <Link
                      href="/book"
                      className="mt-5 inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 bg-[#202b29] dark:bg-accent text-white dark:text-accent-foreground text-[13px] font-[800] transition-all duration-150 hover:-translate-y-px hover:shadow-md"
                    >
                      Book a seat
                    </Link>
                  </div>
                ) : (
                  <ul>
                    {bookingHistory.map((b, i) => (
                      <li
                        key={b.id}
                        className={`flex items-center justify-between gap-4 px-6 py-4 ${
                          i !== bookingHistory.length - 1
                            ? "border-b border-border"
                            : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-[700] truncate">
                            {formatToNormalDate(b.startTime)}
                          </p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            {formatToNormalTime(b.startTime)} –{" "}
                            {formatToNormalTime(b.endTime)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-[800]">
                            ₹{Number(b.totalAmount).toFixed(0)}
                          </p>
                          <span
                            className={`inline-block text-[11px] font-[700] mt-0.5 rounded-full px-2 py-0.5 ${
                              b.bookingStatus === "confirmed" ||
                              b.bookingStatus === "completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : b.bookingStatus === "cancelled"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Section: Membership */}
            {activeSection === "membership" && (
              <div className="rounded-[16px] border border-border bg-background p-6 md:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <SectionLabel>Membership</SectionLabel>
                    <h2 className="text-[20px] font-[800] tracking-tight mb-1">
                      Manage membership
                    </h2>
                    <p className="text-[13px] text-muted-foreground">
                      Monthly and yearly passes for daily players.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-dashed border-muted-foreground px-3 py-1 text-[11px] font-[800] tracking-[0.1em] text-muted-foreground uppercase">
                    Coming soon
                  </span>
                </div>

                {/* Section: Membership Preview */}
                <div className="rounded-[12px] border-2 border-dashed border-foreground/20 bg-muted/30 p-5 md:p-6 mb-6">
                  <div className="flex gap-1.5 mb-3" aria-hidden="true">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <span
                        key={i}
                        className="grid size-8 place-items-center rounded-[6px] bg-muted border border-border text-[11px] font-[800] text-muted-foreground"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="text-[15px] font-[800] mb-1">
                    Daily pass — Play every day, pay once.
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    Choose a fixed number of hours per day, monthly or yearly.
                    Set it once and play whenever.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-muted-foreground/40 animate-pulse" />
                  <p className="text-[13px] text-muted-foreground font-[600]">
                    We're working on it. Check back soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section: Delete Account Confirm Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-[400px] rounded-[18px] border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-[800] tracking-[0.12em] text-destructive uppercase mb-3">
              Confirm deletion
            </p>
            <h3 className="text-[19px] font-[800] tracking-tight mb-2">
              Delete your account?
            </h3>
            <p className="text-[13px] text-muted-foreground mb-6">
              You'll permanently lose your reward points and all booking
              history. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-[10px] border border-border text-[13px] font-[700] text-muted-foreground hover:text-foreground hover:border-foreground/40 cursor-pointer transition-all"
              >
                Keep account
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-[10px] bg-destructive text-white text-[13px] font-[800] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleteLoading ? "Deleting…" : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Section: Icons */
function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RewardsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon({
  active,
  size = 16,
}: {
  active: boolean;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <polyline
        points="12 8 12 12 14 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.05 11a9 9 0 1 0 .5-4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="3 3 3 7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MembershipIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.4 24.4 0 000 21.56l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="#5865F2">
      <path d="M107.7 8.07A105.15 105.15 0 0081.47 0a72.06 72.06 0 00-3.36 6.83 97.68 97.68 0 00-29.11 0A72.37 72.37 0 0045.64 0a105.89 105.89 0 00-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0032.17 16.15 77.7 77.7 0 006.89-11.11 68.42 68.42 0 01-10.85-5.18c.91-.66 1.8-1.34 2.66-2.03a75.57 75.57 0 0064.32 0c.87.71 1.76 1.39 2.66 2.03a68.68 68.68 0 01-10.87 5.19 77 77 0 006.89 11.1 105.25 105.25 0 0032.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15zM42.45 65.69C36.18 65.69 31 60 31 53.05s5-12.68 11.45-12.68S53.99 46.06 53.9 53.05c0 6.95-5.11 12.64-11.45 12.64zm42.24 0C78.41 65.69 73.25 60 73.25 53.05s5-12.68 11.44-12.68 11.51 5.73 11.44 12.68c0 6.95-5.09 12.64-11.44 12.64z" />
    </svg>
  );
}
