export interface ContentKey {
  key: string;
  label: string;
  type: "text" | "textarea" | "richtext";
  section: string;
  helper?: string;
}

export const CONTENT_KEYS: ContentKey[] = [
  // Hero
  {
    key: "hero.tagline",
    label: "Hero tagline",
    type: "text",
    section: "Hero",
    helper: "Main headline shown on the home page hero.",
  },
  {
    key: "hero.subtagline",
    label: "Hero sub-tagline",
    type: "text",
    section: "Hero",
  },
  {
    key: "hero.badge",
    label: "Hero badge text",
    type: "text",
    section: "Hero",
  },

  // About
  {
    key: "about.intro",
    label: "About intro",
    type: "textarea",
    section: "About",
    helper: "Short paragraph shown on the About page.",
  },
  {
    key: "about.mission",
    label: "Mission statement",
    type: "textarea",
    section: "About",
  },
  {
    key: "about.vision",
    label: "Vision statement",
    type: "textarea",
    section: "About",
  },

  // Contact
  {
    key: "contact.email",
    label: "Contact email",
    type: "text",
    section: "Contact",
  },
  {
    key: "contact.address",
    label: "Headquarters address",
    type: "textarea",
    section: "Contact",
  },
  {
    key: "contact.phones",
    label: "Phone numbers (comma-separated)",
    type: "text",
    section: "Contact",
  },

  // Registration
  {
    key: "registration.title",
    label: "Registration page title",
    type: "text",
    section: "Registration",
  },
  {
    key: "registration.subtitle",
    label: "Registration page subtitle",
    type: "text",
    section: "Registration",
  },
];

export const CONTENT_SECTIONS = Array.from(
  new Set(CONTENT_KEYS.map((k) => k.section)),
);
