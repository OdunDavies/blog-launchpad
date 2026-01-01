import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section id="subscribe" className="py-20 md:py-28 bg-card">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Newsletter
          </span>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-6 text-balance">
            Stories delivered to your inbox
          </h2>
          
          <p className="text-muted-foreground text-lg mb-10">
            Join our community of readers and get the best articles, insights, and inspiration delivered weekly.
          </p>

          {isSubmitted ? (
            <div className="animate-fade-up">
              <p className="text-primary text-lg font-medium">
                Thank you for subscribing! Check your inbox soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors duration-300 group"
              >
                Subscribe
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
