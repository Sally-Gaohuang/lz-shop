export type Language = "zh" | "en";

export type Product = {
  id: string;
  category: "skincare" | "hair" | "body" | "makeup";
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
};

export const STORE_URL =
  "https://mall.riman.com/GAOLINZHI/home?country=SG&lang=en-SG";

export const CONTACT_EMAIL = "linzhiatwork@gmail.com";

export const PRODUCTS: Product[] = [
  {
    id: "50053",
    category: "skincare",
    name: "ICD Dermatology First Package",
    nameZh: "ICD Dermatology First 护肤套装",
    description: "A layered skincare set focused on hydration and a fresh-looking finish.",
    descriptionZh: "以分层补水和清爽肤感为重点的护肤套装。",
  },
  {
    id: "50027",
    category: "hair",
    name: "Botalab Deserticola Plus Shampoo",
    nameZh: "Botalab Deserticola Plus 洗发水",
    description: "A rich-foam shampoo designed to cleanse scalp oil and product build-up.",
    descriptionZh: "绵密泡沫配方，用于清洁头皮油脂及造型产品残留。",
  },
  {
    id: "50037",
    category: "hair",
    name: "Botalab Deserticola Plus Conditioner",
    nameZh: "Botalab Deserticola Plus 护发素",
    description: "A water-to-cream conditioner for smoother, more manageable hair.",
    descriptionZh: "水感转乳霜质地，帮助秀发保持柔顺易打理。",
  },
  {
    id: "50200",
    category: "body",
    name: "Botalab Suamel Nourishing Body Wash",
    nameZh: "Botalab Suamel 滋养沐浴露",
    description: "A gentle body cleanser with fine foam and a comfortable after-feel.",
    descriptionZh: "细腻泡沫温和清洁，洗后肤感舒适。",
  },
  {
    id: "50204",
    category: "makeup",
    name: "ICD Sheer Glow BB",
    nameZh: "ICD Sheer Glow BB 霜",
    description: "A smooth BB cream for light coverage and an even-looking complexion.",
    descriptionZh: "轻盈贴肤的 BB 霜，提供自然遮盖及均匀妆效。",
  },
  {
    id: "50678",
    category: "makeup",
    name: "ICD Luminous Moist Cushion SPF50+ PA++++",
    nameZh: "ICD 水光气垫 SPF50+ PA++++",
    description: "A buildable cushion with light, dewy coverage and sun protection.",
    descriptionZh: "可叠加的轻透水光气垫，并提供日常防晒保护。",
  },
];

export function officialProductUrl(productId: string, language: Language) {
  const locale = language === "zh" ? "zh-SG" : "en-SG";
  return `https://mall.riman.com/rmnsocial/products/${productId}?country=SG&lang=${locale}`;
}