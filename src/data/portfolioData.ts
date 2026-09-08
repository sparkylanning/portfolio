import {
  CareerItem,
  ProjectItem,
  PersonalItem,
  ProfileData,
  SkillBubbleItem,
  ApproachPillar,
} from "../types";

// Profile
import zHeadshot from "../assets/images/zHeadshot.jpeg";

// Career images
import hexArmorWorking from "../assets/images/HexArmorWorking.png";
import accountingReal from "../assets/images/accountingReal.png";
import millSteel from "../assets/images/MillSteel.png";
import gfsBuilding from "../assets/images/gfsBuilding.png";
import janitor from "../assets/images/Janitor.png";
import speaking from "../assets/images/Speaking.jpg";
import aldiPhoto from "../assets/images/Aldi.jpg";

// Project images
import hexArmor from "../assets/images/HexArmor.jpg";
import serviScreen from "../assets/images/ServiScreen.jpg";

// Personal images
import discGolfTeam from "../assets/images/DiscGolfTeam.jpg";
import discGolfCourseInstall from "../assets/images/discGolfCourseInstall.jpeg";
import steakReal from "../assets/images/steakReal.png";
import coffee from "../assets/images/Coffee.jpg";
import bibleStudy from "../assets/images/bibleStudy.jpeg";

export const initialApproachPillars: ApproachPillar[] = [
  {
    id: "pillar-1",
    title: "Making Sense of Numbers",
    description:
      "Building simple, practical tools that take the stress and guesswork out of big decisions.",
  },
  {
    id: "pillar-2",
    title: "Clear Steps for Teams",
    description:
      "Writing down clear, friendly guides so everyone stays on the same page and work flows smoothly.",
  },
  {
    id: "pillar-3",
    title: "Caring About Details",
    description:
      "Catching the small discrepancies in logistics schedules, ledgers, and data pipelines to keep operations running right.",
  },
];

export const initialProfileData: ProfileData = {
  name: "Jacob Lanning",
  firstName: "JACOB",
  roleNoun: "analyst.",
  roleFull: "Operations, Supply Chain & Business Analytics Specialist",
  tagline: "Taking raw data to actionable insight, and real change.",
  location: "Grand Rapids, MI",
  university: "Calvin University",
  degree:
    "BS in Operations and Supply Chain Management, BA in Business Analytics",
  graduationYear: "Class of 2027",
  aboutHeadline: "Taking raw data to actionable insight, and real change.",
  shortBio:
    "Hey, I’m Jacob. I study Operations, Supply Chain, and Business Analytics at Calvin University. I love digging into real-world problems and making things run better for the people involved. My experience spans practical supply chain and analytics work, including building Excel decision tools and Standard Operating Procedures at HexArmor, managing invoices and inventory locations at Mill Steel, crafting visual Tableau dashboards at Gordon Food Service, and managing full-cycle financial operations for 120 Main LLC, supported by dedicated facilities work at Calvin. Beyond the desk, you’ll find me out on the disc golf course, grilling steaks for friends, dialing in espresso, and building community.",
  avatarImage: zHeadshot,
  email: "sparkylanning@gmail.com",
  formEndpoint: "https://formspree.io/f/xgaendpp",
  githubUrl: "https://github.com",
  linkedinUrl: "https://www.linkedin.com/in/jacob-lanning",
  twitterUrl: "https://twitter.com",
  instagramUrl: "https://instagram.com",
  approachPillars: initialApproachPillars,
};

export const initialCareerItems: CareerItem[] = [
  {
    id: "hexarmor-supply-chain",
    role: "Supply Chain Intern",
    company: "HexArmor",
    period: "May 2026 - Present",
    location: "Grand Rapids, MI",
    tagline:
      "Building practical Excel tools so product managers can make confident decisions with real data.",
    description:
      "At HexArmor, I help simplify everyday decision-making by building Excel models that give product managers reliable data and creating clear procedures to support smooth team transitions.",
    achievements: [
      "Developed practical Excel templates that gave product managers real numbers and confidence to make consistent choices.",
      "Authored clear Standard Operating Procedures (SOPs) so team handoffs were smooth and no critical knowledge got lost.",
      "Collaborated directly with team leads and product managers to understand their day-to-day bottlenecks and fix them.",
    ],
    skills: [
      "Microsoft Excel",
      "Standard Operating Procedures (SOPs)",
      "Process Improvement",
      "Team Collaboration",
      "Decision Modeling",
    ],
    image: hexArmor,
    projectUrl: "https://www.hexarmor.com",
    featuredQuote:
      "Good operations isn’t about complicated jargon; it’s about giving your team clear tools they can actually rely on.",
  },
  {
    id: "120-main-accountant",
    role: "Accountant",
    company: "120 Main LLC",
    period: "Nov 2023 - Present",
    location: "Zeeland, MI",
    tagline:
      "Handling the books, rent rolls, and cash flow for a local restaurant and residential apartments.",
    description:
      "I manage full-cycle accounting for a small business with over $2 million in assets, handling monthly invoicing, tenant follow-ups, bank reconciliations, vendor payments, and cash flow.",
    achievements: [
      "Managed full-cycle accounting operations for a small business leasing a restaurant and residential apartments, overseeing over $2 million in assets.",
      "Generated and sent invoices to tenants and vendors, tracked payments, and followed up systematically to ensure consistent cash flow.",
      "Reconciled bank accounts and financial statements, finding discrepancies and fixing them right away.",
    ],
    skills: [
      "QuickBooks",
      "Bookkeeping",
      "Bank Reconciliation",
      "Tenant Invoicing",
      "Cash Flow Management",
    ],
    image: accountingReal,
    projectUrl: "#",
    featuredQuote:
      "In a local business, every invoice and dollar matters. Keeping clean books gives everyone peace of mind.",
  },
  {
    id: "mill-steel-supply-chain",
    role: "Supply Chain Intern",
    company: "Mill Steel",
    period: "Nov 2025 - May 2026",
    location: "Grand Rapids, MI",
    tagline:
      "Coordinating carrier freight movements, resolving logistics discrepancies, and supporting distribution operations.",
    description:
      "In a fast-paced steel distribution environment, I coordinated carrier shipments and audited shipping records to ensure pricing, quantities, and delivery locations were accurate. I also managed a high-volume operations inbox to quickly resolve issues.",
    achievements: [
      "Audited freight and shipping documents to verify accurate delivery routing, pricing, and material specifications, preventing shipment delays.",
      "Managed an active logistics operations communications channel, prioritizing carrier requests and keeping material moving efficiently.",
      "Partnered cross-functionally with warehouse receiving and purchasing to investigate root causes of delivery variances and resolve discrepancies.",
    ],
    skills: [
      "Logistics Coordination",
      "Freight Scheduling",
      "Discrepancy Resolution",
      "Cross-Functional Communication",
      "ERP Systems",
    ],
    image: millSteel,
    projectUrl: "https://millsteel.com",
    featuredQuote:
      "Catching discrepancies early in logistics schedules and routing documents saves everyone downstream critical time and money.",
  },
  {
    id: "gordon-food-service",
    role: "Category Insights Specialist",
    company: "Gordon Food Service",
    period: "May 2025 - Aug 2025",
    location: "Wyoming, MI",
    tagline:
      "Translating complex sales numbers into simple, actionable pricing stories for category managers.",
    description:
      "I analyzed and visualized large volumes of food service sales data, building Tableau dashboards and presentations that helped category managers identify margin changes and make strategic pricing decisions.",
    achievements: [
      "Transformed raw data into actionable insights by cleaning, analyzing, and visualizing trends, then crafting clear, data-driven stories to guide category managers in pricing and strategic decisions.",
      "Delivered presentations that simplified complex analyses, helping teams make informed pricing choices that delivered real business value.",
      "Built clean, intuitive visual dashboards to track product margins and sales volumes over time.",
    ],
    skills: [
      "Tableau",
      "Data Cleaning",
      "Visual Storytelling",
      "Pricing Analysis",
      "Presentations",
    ],
    image: speaking,
    projectUrl: "https://gfs.com",
    featuredQuote:
      "Data is only useful if people can understand it and act on it. My job was to make the story clear and simple.",
  },
  {
    id: "aldi-store-associate",
    role: "Store Associate",
    company: "ALDI",
    period: "2024 - 2025",
    location: "Grand Rapids, MI",
    tagline:
      "Juggling competing priorities and connecting with all kinds of people on a fast-paced retail floor.",
    description:
      "Working at ALDI during my underclassman years taught me how to juggle competing priorities, connect with all kinds of people, and solidified my love for food.",
    achievements: [
      "Balanced multiple competing priorities in a fast-paced retail environment.",
      "Built strong communication skills by connecting with a wide variety of customers and coworkers daily.",
      "Developed a genuine appreciation for food and retail operations.",
    ],
    skills: [
      "Time Management",
      "Customer Service",
      "Multitasking",
      "Team Collaboration",
    ],
    image: aldiPhoto,
    projectUrl: "https://www.aldi.us",
    featuredQuote:
      "Working at ALDI showed me that juggling priorities well and treating people right go hand in hand.",
  },
  {
    id: "calvin-facilities-custodian",
    role: "Facilities Custodian",
    company: "Unity Christian Facilities",
    period: "Sep 2021 - Apr 2023",
    location: "Hudsonville, MI",
    tagline:
      "Keeping campus academic halls and event spaces clean, safe, and welcoming.",
    description:
      "I worked custodial shifts maintaining academic halls, offices, and high-traffic event spaces across campus. I operated commercial cleaning machinery, handled chemical sanitization, and completed room turnovers with reliable self-direction and strong attention to detail.",
    achievements: [
      "Cleaned, sanitized, and maintained classrooms, administrative offices, and high-traffic common areas.",
      "Operated commercial floor care machinery and safely handled sanitization supplies according to OSHA guidelines.",
      "Worked independently with self-direction during early morning and evening facility turnovers.",
    ],
    skills: [
      "Facilities Maintenance",
      "Equipment Operation",
      "Sanitation Protocols",
      "Independent Initiative",
      "Detail Orientation",
    ],
    image: janitor,
    projectUrl: "https://calvin.edu",
    featuredQuote:
      "Doing the behind-the-scenes work with pride teaches you discipline and a deep appreciation for the people who keep things running.",
  },
];

export const initialProjects: ProjectItem[] = [
  {
    id: "proj-excel-decision-framework",
    title: "Product Decision Model",
    category: "Decision Modeling",
    organization: "HexArmor",
    period: "2026",
    tagline:
      "A clean, intuitive Excel model that helps product teams compare options with real numbers.",
    description:
      "Built a flexible spreadsheet model that helps product managers compare costs, suppliers, and operational factors to make informed product decisions, along with a step-by-step guide to ensure the model is easy for anyone on the team to use.",
    keyOutcomes: [
      "Gave product managers a reliable, uniform way to evaluate new product ideas",
      "Built-in sensitivity checks to see how price and shipping changes affect margins",
      "Wrote a clear, friendly SOP guide so new team members can jump right in",
    ],
    toolsUsed: [
      "Microsoft Excel",
      "Decision Frameworks",
      "SOP Writing",
      "Workflow Design",
    ],
    image: hexArmorWorking,
  },
  {
    id: "proj-category-pricing-analytics",
    title: "Category Pricing Dashboards",
    category: "Business Analytics",
    organization: "Gordon Food Service",
    period: "2025",
    tagline:
      "Turning messy sales records into interactive Tableau charts and clear presentations.",
    description:
      "Took large, cluttered datasets and cleaned them up to build presentations. These visuals helped category managers spot margin trends, understand customer behavior, and make confident pricing adjustments.",
    keyOutcomes: [
      "Created intuitive Tableau dashboards that made sales trends easy to spot at a glance",
      "Shared plain-language takeaways with managers so they could make quick pricing choices",
      "Standardized weekly data prep so updates took minutes instead of hours",
    ],
    toolsUsed: ["Data Cleaning", "Margin Analysis", "Visual Storytelling"],
    image: gfsBuilding,
  },
  {
    id: "proj-120-main-ledger",
    title: "Disc Golf Course Installation",
    category: "Operations",
    organization: "Calvin Univeristy",
    period: "2025",
    tagline: "",
    description:
      "As part of a hands-on project management challenge, I took the initiative to redesign Calvin’s campus disc golf course. Leveraging relationships across the campus disc golf community, I led the end-to-end design, installation, and launch of an entirely new 9-hole course.",
    keyOutcomes: [
      "Implemented 9 hole course, accessible for students on campus",
      "Separated commercial restaurant operational costs from residential rental expenses in the chart of accounts",
      "Eliminated billing discrepancies with timely monthly bank and ledger reconciliations",
    ],
    toolsUsed: [
      "Course Planning",
      "Operational Execution",
      "Community Engagement",
    ],
    image: discGolfCourseInstall,
  },
];

export const initialPersonalItems: PersonalItem[] = [
  {
    id: "personal-disc-golf",
    title: "Calvin Disc Golf Founder & President",
    subtitle:
      "Building a team, organizing trips, and competing at Collegiate Nationals",
    description:
      "I started the Calvin University Disc Golf Team from scratch. From finding teammates and fundraising to planning road trips and tournament logistics across the country, it taught me a lot about leadership and bringing people together around a shared passion. Competing in two Collegiate National Championships was an unforgettable experience.",
    image: discGolfTeam,
    category: "Sports & Community",
    tags: ["Calvin Disc Golf", "Team President", "2x Nationals", "Road Trips"],
  },
  {
    id: "personal-steak-cooking",
    title: "The Craft of Cooking Steaks",
    subtitle:
      "Cast-iron sears, charcoal grilling, and cooking great meals for friends",
    description:
      "Cooking steak is one of my favorite culinary hobbies. I love the precision and patience of getting the temperature, crust, and seasoning just right, whether reverse-searing a thick ribeye in cast iron or grilling over hot coals for friends and family.",
    image: steakReal,
    category: "Culinary & Cooking",
    tags: ["Reverse Sear", "Cast Iron", "Grilling", "Cooking for Friends"],
  },
  {
    id: "personal-specialty-coffee",
    title: "Specialty Coffee & Espresso",
    subtitle:
      "Dialing in espresso grind sizes, pour-overs, and morning rituals",
    description:
      "I am an avid coffee enthusiast. I enjoy dialing in espresso grind sizes, exploring different single-origin beans, and perfecting manual pour-overs. It is a morning ritual that blends patience, precision, and craft.",
    image: coffee,
    category: "Craft & Routine",
    tags: [
      "Specialty Coffee",
      "Espresso Dial-in",
      "Pour-Over",
      "Single-Origin Beans",
    ],
  },
  {
    id: "personal-bible-study",
    title: "Campus Bible Study & Faith",
    subtitle:
      "Weekly fellowship, real conversations, and building community at Calvin",
    description:
      "I organize and lead weekly Bible study gatherings on campus. It’s an open, welcoming space where students can be themselves, ask honest questions, encourage one another, and build authentic friendships that last well beyond college.",
    image: bibleStudy,
    category: "Faith & Community",
    tags: [
      "Calvin University",
      "Weekly Gatherings",
      "Open Conversations",
      "Community",
    ],
  },
];

export const consolidatedSkills = [
  "Supply Chain Operations",
  "Cross-Functional Collaboration",
  "Excel Decision Modeling",
  "Stakeholder Communication",
  "Standard Operating Procedures (SOPs)",
  "Full-Cycle Bookkeeping",
  "Tableau Visual Storytelling",
  "Strategic Problem Solving",
  "Continuous Improvement (Kaizen)",
  "Freight & Logistics Coordination",
  "Inventory & Asset Control",
  "Pricing & Margin Strategy",
  "Vendor & Partner Relations",
  "QuickBooks Online",
  "Adaptability & Initiative",
];

export const initialSkillBubbles: SkillBubbleItem[] = [
  // --- LEADERSHIP & SOFT SKILLS (Prominent & High-Impact) ---
  {
    id: "skill-cross-functional",
    name: "Cross-Functional Collaboration",
    category: "soft-skills",
    categoryLabel: "Leadership & Soft Skills",
    size: "lg",
    context:
      "Bridging the gap between warehouse personnel, product managers, executive leadership, and external suppliers to keep operations aligned.",
  },
  {
    id: "skill-stakeholder-comm",
    name: "Stakeholder Communication",
    category: "soft-skills",
    categoryLabel: "Leadership & Soft Skills",
    size: "lg",
    context:
      "Translating complex supply chain bottlenecks and dense analytics into clear, executive-ready presentations and action items.",
  },
  {
    id: "skill-problem-solving",
    name: "Strategic Problem Solving",
    category: "soft-skills",
    categoryLabel: "Leadership & Soft Skills",
    size: "lg",
    context:
      "Diagnosing root causes in operational friction and developing practical, lasting solutions that cross-functional teams embrace.",
  },
  {
    id: "skill-continuous-improvement",
    name: "Continuous Improvement (Kaizen)",
    category: "soft-skills",
    categoryLabel: "Leadership & Soft Skills",
    size: "md",
    context:
      "Applying Lean mindset and feedback loops to systematically eliminate operational waste and streamline daily workflows.",
  },
  {
    id: "skill-vendor-relations",
    name: "Vendor & Partner Relations",
    category: "soft-skills",
    categoryLabel: "Leadership & Soft Skills",
    size: "md",
    context:
      "Maintaining trusted, proactive relationships with suppliers, logistics carriers, and commercial tenants.",
  },
  {
    id: "skill-adaptability",
    name: "Adaptability & Initiative",
    category: "soft-skills",
    categoryLabel: "Leadership & Soft Skills",
    size: "sm",
    context:
      "Thriving in fast-paced operational settings with self-directed focus, high ownership, and proactive follow-through.",
  },

  // --- OPERATIONS & SUPPLY CHAIN ---
  {
    id: "skill-supply-chain",
    name: "Supply Chain Operations",
    category: "operations",
    categoryLabel: "Operations & Logistics",
    size: "lg",
    context:
      "Managing end-to-end logistics, carrier dispatch, material movements, and inventory flow across industrial networks.",
  },
  {
    id: "skill-sops",
    name: "Standard Operating Procedures (SOPs)",
    category: "operations",
    categoryLabel: "Operations & Logistics",
    size: "md",
    context:
      "Authoring clean, step-by-step operating guidelines so team handoffs are seamless and operational knowledge is permanently retained.",
  },
  {
    id: "skill-inventory-management",
    name: "Inventory & Asset Control",
    category: "operations",
    categoryLabel: "Operations & Logistics",
    size: "md",
    context:
      "Monitoring inventory velocity, reconciling physical counts against ERP records, and controlling material shrinkage.",
  },
  {
    id: "skill-logistics-coordination",
    name: "Freight & Logistics Coordination",
    category: "operations",
    categoryLabel: "Operations & Logistics",
    size: "md",
    context:
      "Triaging shipment manifests, tracking on-time delivery rates, and proactively resolving freight transit delays.",
  },
  {
    id: "skill-custodial",
    name: "Facilities Management",
    category: "operations",
    categoryLabel: "Operations & Facilities",
    size: "sm",
    context:
      "Operating commercial equipment, ensuring safety compliance, and taking personal pride in well-maintained environments.",
  },

  // --- ANALYTICS & BUSINESS INTELLIGENCE ---
  {
    id: "skill-excel",
    name: "Excel Decision Modeling",
    category: "analytics",
    categoryLabel: "Analytics & Modeling",
    size: "lg",
    context:
      "Building clean decision spreadsheets, sensitivity tables, and financial frameworks so teams evaluate choices with confidence.",
  },
  {
    id: "skill-tableau",
    name: "Tableau Visual Storytelling",
    category: "analytics",
    categoryLabel: "Analytics & BI",
    size: "lg",
    context:
      "Turning millions of rows of sales and operations data into intuitive, interactive dashboards that drive executive action.",
  },
  {
    id: "skill-category-insights",
    name: "Pricing & Margin Strategy",
    category: "analytics",
    categoryLabel: "Analytics & Strategy",
    size: "md",
    context:
      "Uncovering margin variances, evaluating customer price elasticity, and structuring competitive product portfolios.",
  },
  {
    id: "skill-data-cleaning",
    name: "Data Pipeline Hygiene",
    category: "analytics",
    categoryLabel: "Analytics & Data",
    size: "sm",
    context:
      "Cleaning, restructuring, and validating messy real-world datasets into standardized reporting schemas.",
  },

  // --- FINANCIAL OPERATIONS ---
  {
    id: "skill-accounting",
    name: "Full-Cycle Bookkeeping",
    category: "finance",
    categoryLabel: "Financial Operations",
    size: "lg",
    context:
      "Directing general ledgers, monthly bank reconciliations, and cash flow for commercial property and retail operations.",
  },
  {
    id: "skill-quickbooks",
    name: "QuickBooks Online",
    category: "finance",
    categoryLabel: "Financial Operations",
    size: "sm",
    context:
      "Posting ledger entries, reconciling accounts, tracking tenant receipts, and generating accurate financial statements.",
  },
];
