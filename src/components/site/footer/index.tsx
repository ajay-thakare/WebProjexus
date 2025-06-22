import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "/site/features" },
      { name: "Pricing", href: "/site/pricing" },
      // { name: "Integrations", href: "#" },
      // { name: "API", href: "#" },
    ],
    resources: [
      { name: "Documentation", href: "/site/docs" },
      // { name: "Blog", href: "#" },
      { name: "Support", href: "/site/support" },
      // { name: "Community", href: "#" },
    ],
    company: [
      { name: "About", href: "/site/about" },
      // { name: "Careers", href: "#" },
      { name: "Terms of Service", href: "/site/terms" },
      { name: "Privacy Policy", href: "/site/privacy" },
      { name: "Contact Us", href: "/site/contact" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "#", icon: "tw" },
    {
      name: "LinkedIn",
      href: "#",
      icon: "li",
    },
    {
      name: "GitHub",
      href: "https://github.com/ajay-thakare/WebProjexus",
      icon: "gh",
    },
  ];

  return (
    <footer className="py-16 border-t border-muted-foreground/20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text hover:opacity-80 transition-opacity">
                WebPro
              </h3>
            </Link>
            <p className="text-muted-foreground">
              The ultimate platform for agency management and website creation.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 cursor-pointer transition-colors group"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <span className="text-sm font-bold group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2 text-muted-foreground">
              {footerLinks.product.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block hover:text-foreground cursor-pointer transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <div className="space-y-2 text-muted-foreground">
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block hover:text-foreground cursor-pointer transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <div className="space-y-2 text-muted-foreground">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-muted-foreground/20 pt-8 text-center text-muted-foreground">
          <p>© {currentYear} WebPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
