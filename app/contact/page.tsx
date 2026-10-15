"use client";

import { useRef, useState } from "react";
import type { FocusEvent, FormEvent, KeyboardEvent, ReactElement } from "react";
import { ArrowUpRight, CheckCheck, Send } from "lucide-react";

import { CircuitTrace, Keycap, PageHeader, SectionHeading, StatusTag } from "@/components/open-circuit";
import { playClickSound, playKeyboardSound } from "@/utils/sound";

import styles from "./contact.module.css";

/** Open a channel through the existing inbox form or a direct profile link. */
export default function Contact(): ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [notification, setNotification] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (event.key.length === 1 || event.key === "Backspace" || event.key === "Enter" || event.key === " ") {
      playKeyboardSound();
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = (event: FocusEvent<HTMLInputElement>): void => {
    const email = event.target.value;
    setEmailError(email && !validateEmail(email) ? "Please enter a valid email address" : null);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    playClickSound();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setNotification("Please enter a valid email address");
      formRef.current?.querySelector<HTMLInputElement>("#email")?.focus();
      return;
    }

    setIsSubmitting(true);
    setNotification("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name"), email, message: formData.get("message") }),
      });
      const result: { error?: string } = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        setEmailError(null);
        setNotification("Message sent successfully. It's in my inbox.");
        formRef.current?.reset();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNotification("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <PageHeader command="$ ./connect.sh --secure" note="my inbox / make your entrance" title={<>My inbox.<br /><span className="oc-green">Make it count.</span></>} description="I secure xCloud at Startise and have disclosed 9 CVEs. Bring me a problem worth solving. A little context will get you further than a very enthusiastic hello." />
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="channel-heading">
          <SectionHeading path="contact" title="Give me the good part." id="channel-heading" note="my inbox / your best pitch" />
          <div className={styles.channel}>
            <div className={styles.transmission}>
              <div className={styles.formHeader}><span className="oc-small">My inbox / Easin Arafat</span><StatusTag tone="neutral">{isSuccess ? "SENT" : isSubmitting ? "SENDING" : "READY"}</StatusTag></div>
              <div className={styles.formBody}>
                <div className={styles.notification} role="status" aria-live="polite" aria-atomic="true">
                  {notification && <p className={isSuccess ? styles.successText : styles.error}>{notification}</p>}
                </div>
                {isSuccess ? (
                  <div className={styles.receipt}>
                    <CheckCheck size={48} aria-hidden="true" />
                    <h3>You made it to my inbox.</h3>
                    <p>I&apos;ve got your message. Good entrance.</p>
                    <Keycap command="$ ./connect.sh --new" onClick={() => { playClickSound(); setIsSuccess(false); setNotification(""); }}>Send Another Message</Keycap>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleFormSubmit} className={styles.form} aria-busy={isSubmitting}>
                    <p className={styles.required}>All fields are required.</p>
                    <div className={styles.sender}>
                      <div className={styles.field}>
                        <label htmlFor="name">Your Name</label>
                        <input id="name" name="name" type="text" autoComplete="name" required onKeyDown={handleKeyPress} placeholder="Ingrid Bergman" />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="email">Your Email</label>
                        <input id="email" name="email" type="email" autoComplete="email" required onKeyDown={handleKeyPress} onBlur={handleEmailBlur} aria-invalid={emailError ? true : undefined} aria-describedby={emailError ? "email-error" : undefined} placeholder="ingrid@example.com" />
                        {emailError && <p id="email-error" className={styles.error}>{emailError}</p>}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="message">Your Message</label>
                      <textarea id="message" name="message" rows={7} required onKeyDown={handleKeyPress} placeholder="Hello Arafat, I wanna reach out to you for..." />
                    </div>
                    <Keycap type="submit" disabled={isSubmitting} variant="primary" command={isSubmitting ? "Sending to the inbox..." : "$ ./connect.sh --send"}>
                      <span className={styles.sendLabel}><Send size={18} aria-hidden="true" />{isSubmitting ? "Sending..." : "Send Message"}</span>
                    </Keycap>
                  </form>
                )}
              </div>
            </div>
            <section className={styles.channelNotes} aria-labelledby="context-heading">
              <p className="oc-command">$ cat brief.txt</p>
              <h3 id="context-heading">I like a challenge. Include details.</h3>
              <p className={styles.context}>I work across application security, xCloud and vulnerability research. Tell me what you&apos;re building, what&apos;s broken or what you think I should take on next.</p>
              <div className={styles.delivery}><ArrowUpRight size={24} aria-hidden="true" /><p>I need the goal, the constraints and enough context to skip the guessing game. My inbox accepts ambition. Attach specifics.</p></div>
              <p className="oc-small oc-soft">Find me here, too</p>
              <div className={styles.directLinks}>
                <Keycap href="https://www.linkedin.com/in/e4rafat" command="linkedin.com/in/e4rafat">LinkedIn</Keycap>
                <Keycap href="https://github.com/mrx-arafat" command="github.com/mrx-arafat">GitHub</Keycap>
              </div>
            </section>
          </div>
        </section>
      </CircuitTrace>
    </main>
  );
}
