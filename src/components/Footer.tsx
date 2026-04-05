import { Github, Linkedin, Mail } from "lucide-react";
import { DiscordIcon, TelegramIcon } from "@/components/icons/BrandSocialIcons";
import { SOCIAL_URLS } from "@/constants/social";

const socialLinks = [
  { icon: Linkedin, href: SOCIAL_URLS.linkedin, label: "LinkedIn" },
  { icon: Mail, href: SOCIAL_URLS.gmail, label: "Gmail" },
  { icon: TelegramIcon, href: SOCIAL_URLS.telegram, label: "Telegram" },
  { icon: DiscordIcon, href: SOCIAL_URLS.discord, label: "Discord" },
  { icon: Github, href: SOCIAL_URLS.github, label: "GitHub" },
] as const;

const Footer = () => {
  return (
    <footer className="border-t border-border py-5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
            © 2026 <span className="text-primary">Jesus Monroig</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end sm:gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all duration-300 hover:bg-muted/60 hover:text-primary"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
