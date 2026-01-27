import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ContactUs = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Load user data from AuthContext
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.message.trim()) {
      alert("Message is required");
      return;
    }

    // TODO: Replace with actual API call
    console.log("Contact form submitted:", form);
    alert("Thank you for your message! We'll get back to you soon.");

    // Clear message after submit
    setForm((prev) => ({ ...prev, message: "" }));
  };

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-start pt-2 px-4 pb-2">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-normal text-gray-900 mb-10">
        Contact Us
      </h1>

      {/* FORM CARD */}
      <div
        className="w-full max-w-lg rounded-xl p-8"
        style={{ backgroundColor: "#f5f6f8" }}
      >
        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white rounded py-3 px-4 text-gray-700 focus:outline-none shadow-sm"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white rounded py-3 px-4 text-gray-700 focus:outline-none shadow-sm"
              required
            />
          </div>

          {/* MESSAGE */}
          <div className="mb-10">
            <label className="block text-sm text-gray-700 mb-2">
              Message
            </label>
            <textarea
              placeholder="Enter your message here"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full bg-white rounded py-3 px-4 text-gray-700 h-32 resize-none focus:outline-none shadow-sm"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-500 text-white px-10 py-3 rounded-full text-lg hover:bg-indigo-600 transition"
            >
              Submit
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default ContactUs;
