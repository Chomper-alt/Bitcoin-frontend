import React from "react";
import "../styles/Terms.css";

export default function Terms() {
  const lastUpdated = "2025-10-01";

  return (
    <div className="terms-page">
      <div className="terms-card">
        <header className="terms-header">
          <h1>Terms &amp; Conditions</h1>
          <p className="terms-updated">Last updated: {lastUpdated}</p>
        </header>

        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>MetaX Traders</strong> (the "Platform"). These Terms &amp;
            Conditions ("Terms") govern your access to and use of the Platform, services,
            and content offered by MetaX Traders. By registering, accessing, or using the
            Platform you agree to be bound by these Terms. If you do not agree, do not use
            the Platform.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Eligibility</h2>
          <ul>
            <li>You must be at least 18 years old (or the legal age in your jurisdiction) to register.</li>
            <li>You must have the legal capacity to form a binding contract.</li>
            <li>By registering you confirm the information you provide is accurate and current.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Accounts &amp; Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials.
            Notify us immediately if you suspect unauthorized use of your account. We are not
            liable for losses resulting from compromised credentials when caused by your failure
            to safeguard them.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Services Provided</h2>
          <p>
            MetaX Traders provides tools for cryptocurrency wallet management, deposits and withdrawals,
            trading and copy trading features, and account-related services. We may modify, suspend,
            or discontinue features at any time without prior notice.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Financial &amp; Trading Risks</h2>
          <p>
            Cryptocurrency and derivatives trading involves substantial risk. Prices are volatile,
            and you may lose your entire investment. Nothing on the Platform constitutes financial,
            investment, tax, or legal advice. All trading decisions are made by you and at your risk.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Deposits, Withdrawals &amp; Fees</h2>
          <p>
            Any fees, minimums, or other charges will be disclosed before you confirm a transaction.
            We reserve the right to change fee structures; such changes will be posted on the Platform.
            Withdrawals may require administrative approval per our internal policies.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. User Conduct</h2>
          <p>
            When using the Platform you must not:
          </p>
          <ul>
            <li>Violate any applicable laws or regulations.</li>
            <li>Attempt to hack, manipulate, or reverse-engineer the services.</li>
            <li>Engage in fraudulent, dishonest, or abusive behavior.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>8. Content &amp; Intellectual Property</h2>
          <p>
            All content on the Platform — including logos, brand assets, text, and software — is protected by intellectual
            property rights and owned by MetaX Traders or our licensors. You may not copy, reproduce, or redistribute content
            without our prior written permission.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Privacy</h2>
          <p>
            Your use of the Platform is also governed by our Privacy Policy. By using the Platform you consent to the collection
            and processing of your personal data as described in that policy.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Limitations of Liability</h2>
          <p>
            To the fullest extent permitted by law, MetaX Traders and its affiliates will not be liable for any indirect,
            incidental, special or consequential damages, or loss of profits, revenue, data, or use. Our total aggregate liability
            to you for any claim arising from these Terms will not exceed amounts you have paid to us in the prior 12 months, or
            USD $100, whichever is greater.
          </p>
        </section>

        <section className="terms-section">
          <h2>11. Suspension &amp; Termination</h2>
          <p>
            We may suspend or terminate your access if you breach these Terms or engage in activity that threatens the Platform or
            other users. We will notify you where appropriate and permitted.
          </p>
        </section>

        <section className="terms-section">
          <h2>12. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of [Your Jurisdiction]. Any dispute arising from or related to these Terms shall
            be resolved in the courts located in [Your Jurisdiction], unless otherwise agreed in writing.
          </p>
        </section>

        <section className="terms-section">
          <h2>13. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Updated terms will be posted here with a revised "Last updated" date.
            Continued use of the Platform after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="terms-section contact-section">
          <h2>14. Contact</h2>
          <p>
            Questions or concerns about these Terms? Contact us at
            <a className="mailto" href="mailto:support@MetaX.com"> support@MetaX.com</a>.
          </p>
        </section>

        <footer className="terms-footer">
          <small>© {new Date().getFullYear()} MetaX Traders. All rights reserved.</small>
        </footer>
      </div>
    </div>
  );
}
