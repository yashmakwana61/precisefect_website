export const CONTACT_INFO = {
  email: "info@precisefect.com",
  phone: "+91 6353564970",
  phoneHref: "tel:+916353564970",
  address: "Ahmedabad, India",
} as const;

export const CONTACT_FOOTER_ITEMS = [
  { label: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
  { label: CONTACT_INFO.phone, href: CONTACT_INFO.phoneHref },
  { label: CONTACT_INFO.address, href: "" },
  { label: "Submit RFP →", href: "/contact" },
];
