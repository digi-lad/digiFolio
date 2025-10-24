import React, { ReactNode } from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Instagram,
  Facebook,
} from "lucide-react";

export interface ContactChannel {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  type: "copy" | "link";
  url?: string;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    label: "EMAIL",
    icon: <Mail size={18} />,
    value: "lvtnhan.418@gmail.com",
    type: "copy" as const,
  },
  {
    id: "phone",
    label: "PHONE",
    icon: <Phone size={18} />,
    value: "(+84) 372 783 659",
    type: "copy" as const,
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    icon: <Linkedin size={18} />,
    url: "https://www.linkedin.com/in/lvtnhan",
    value: "linkedin.com/in/lvtnhan",
    type: "link" as const,
  },
  {
    id: "github",
    label: "GITHUB",
    icon: <Github size={18} />,
    url: "https://github.com/digi-lad",
    value: "github.com/digi-lad",
    type: "link" as const,
  },
  {
    id: "instagram",
    label: "INSTAGRAM",
    icon: <Instagram size={18} />,
    url: "https://www.instagram.com/digi.lad/",
    value: "instagram.com/digi.lad/",
    type: "link" as const,
  },
  {
    id: "facebook",
    label: "FACEBOOK",
    icon: <Facebook size={18} />,
    url: "https://web.facebook.com/digilad.lvtn",
    value: "facebook.com/digilad.lvtn",
    type: "link" as const,
  },
];
