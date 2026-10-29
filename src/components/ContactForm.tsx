"use client";
import { useState } from "react";
export default function ContactForm({ email }: { email: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const body = `Hi Emman,\n\n${data.get("message")}\n\nFrom: ${data.get("name")}\nReply to: ${data.get("email")}`;
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(body)}`;
        setOpened(true);
      }}
    >
      <label>
        Your name
        <input
          name="name"
          autoComplete="name"
          placeholder="What should I call you?"
          required
          maxLength={100}
        />
      </label>
      <label>
        Your email
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={200}
        />
      </label>
      <label>
        What brings you to the pond?
        <select name="subject">
          <option>A project idea</option>
          <option>A collaboration</option>
          <option>A work opportunity</option>
          <option>Just saying hello</option>
        </select>
      </label>
      <label>
        Your message
        <textarea
          name="message"
          rows={6}
          placeholder="Tell me a little about your idea…"
          required
          maxLength={3000}
        />
      </label>
      <button className="dark-button" type="submit">
        Hop into my inbox ↗
      </button>
      <p className="form-note">
        Opens a draft in your email app. Review it there and press send.
      </p>
      {opened && (
        <p role="status">
          Your email app should open with your draft. If it doesn’t, email me at{" "}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>
      )}
    </form>
  );
}
