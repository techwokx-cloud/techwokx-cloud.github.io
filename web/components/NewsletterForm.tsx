"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex w-full gap-2 sm:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="you@company.com"
        className="focus-ring w-full rounded-lg border border-white/10 bg-navy-700 px-4 py-2.5 text-sm placeholder:text-mist sm:w-56"
      />
      <button className="btn-gradient focus-ring rounded-lg px-4 py-2.5 text-sm">
        Subscribe
      </button>
    </form>
  );
}
