import React, { useState } from "react";

export default function SubmitTicket() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    // Send form data to backend
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("✅ Ticket submitted successfully!");
        setFormData({ name: "", email: "", issue: "" });
      } else {
        const errorData = await response.json();
        setSuccess(`❌ ${errorData.message || "Submission failed."}`);
      }
    } catch (err) {
      setSuccess(`❌ ${err.message}`);
    }
  };

  return (
    <div className="ticket-form-container">
      <h2>Submit a Support Ticket</h2>
      <form className="ticket-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Issue:
          <textarea
            name="issue"
            placeholder="Describe your issue"
            value={formData.issue}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit Ticket</button>
        {success && <p className="ticket-success">{success}</p>}
      </form>
    </div>
  );
}
