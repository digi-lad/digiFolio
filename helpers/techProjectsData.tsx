export const TECH_PROJECTS_DATA = {
  ScamDetector: {
    name: "digiSecure - AI-powered Multiformat Scam Detector",
    type: "Web Application",
    status: "COMPLETED" as const,
    timeframe: "2025",
    bootSequence:
      "An intelligent web application that analyzes any format—text messages, website links, or screenshots—to identify potential scam attempts. Leverages AI to provide real-time threat assessment.",
    sysSpecs: [
      "HTML5, Tailwind CSS, and  Vanilla JavaScript for frontend",
      "AI Model: Google Gemini 2.5 flash",
      "Cheerio.js for web scraping",
      "Deployed on Vercel",
    ],
    buildLog: [
      {
        title: "Live Web Scraper",
        desc: "When a URL is submitted, the Node.js backend uses Cheerio to actively fetch the webpage. It scrapes visible text, inspects <form> actions, and analyzes external <script> sources to identify technical red flags that a user would miss",
      },
      {
        title: "Advanced Prompt Engineering",
        desc: "Implements a 'Chain-of-Thought' and 'few-shot learning' prompt structure, ensuring a consistent, high-quality analysis",
      },
      {
        title: "Enforced JSON Schema",
        desc: "Leverages Gemini's JSON mode with a strict response schema. This guarantees the API output is always perfectly structured, preventing frontend errors and ensuring the verdict, confidence, reason, and red_flags are always displayed reliably",
      },
    ],
    accessPoints: [
      {
        label: "Web App",
        url: "https://digi-secure-git-main-digilad.vercel.app/",
      },
      { label: "Github", url: "https://github.com/digi-lad/digiSecure" },
    ],
    images: [
      {
        filename: "Interface",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761206909/Screenshot_2025-10-23_150344_xjzibj.png",
      },
      {
        filename: "Use case example",
        url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761207727/7147352054142_ihqgxj.mp4",
      },
    ] as Array<{ filename: string; url: string }>,
  },
  GNN_Vulnerability: {
    title: "Vulnerability of Graph Neural Networks to Adversarial Attacks",
    field: "Machine Learning",
    date: "2025",
    abstract:
      "Under the guidance of a PhD Student specializing in the field, this exploratory study investigates the susceptibility of Graph Neural Networks (GNNs) to adversarial perturbations in graph-structured data, specifically examining how graph properties, such as node degree , and training data distribution correlate with model vulnerability.",
    methodology: [
      "Conducted a baseline 'Random Attack' to test GCN model vulnerability by randomly adding or deleting edges connected to a target node",
      "Implemented a gradient-based attack algorithm that achieved a 97.9% success rate.",
    ],
    keyFindings: [
      "A strong negative correlation was found between a node's degree and its vulnerability; nodes with a lower degree (fewer connections) are significantly easier to attack successfully",
      "Model robustness is linked to data distribution; models trained on imbalanced datasets are more vulnerable when attacking nodes from the minority class, as the model learns unstable representations and larger gradients for these nodes.",
    ],
    resources: [
      {
        label: "Paper",
        url: "https://drive.google.com/file/d/1pzvTSIEH9-VSBgVBKvZA1WT3fj92JFn0/view",
      },
      {
        label: "Notebook",
        url: "https://colab.research.google.com/drive/1fnu26nZL7CtPn2LXbucNTWpZqF1Eo4ct#scrollTo=UtJtOLODPVY5",
      },
    ],
    images: [
      {
        filename: "Gradient-based Attack Versus Random Attack",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761205739/download_1_spunn5.png",
      },
      {
        filename: "Attack Success Rate on 0-skewed Dataset vs 1-skewed Dataset",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761205740/download_2_oigrx3.png",
      },
    ] as Array<{ filename: string; url: string }>,
  },
  TAVIS_SciLens: {
    name: "TAVIS SciLens - Science Lens",
    type: "Exclusive Web Application",
    status: "ACTIVE" as const,
    timeframe: "2025-?",
    bootSequence:
      "An application designed to assist visually impaired students, particularly in Science subjects like Chemistry and Physics. Its core mission is to make visual information from textbook images accessible by converting them into detailed, step-by-step audio descriptions using AI. The app aims to provide not just a description, but also explanations and context, acting like a virtual teacher guiding the student through the image.",
    sysSpecs: [
      "HTML5, CSS3, JavaScript for frontend",
      "Node.js with Express for backend",
      "Deployed on Vercel (frontend) and Render (backend)",
      "AI Model: Google Gemini 2.5 Flash Lite",
      "UptimeRobot for pinging the backend service",
    ],
    buildLog: [
      {
        title: "AI-Powered Image Description",
        desc: "Leverages Gemini Vision to generate detailed, context-aware descriptions and explanations of scientific images",
      },
      {
        title: "Accessibility First UI",
        desc: "Features a high-contrast, full-screen interface designed for ease of use. Interaction is primarily touch-based",
      },
      {
        title: "Gesture-Based Audio Control",
        desc: "Allows users to control the audio playback using intuitive gestures",
      },
      {
        title: "Synchronized Auto-Scrolling Text",
        desc: "The description text automatically scrolls in sync with the audio playback for users with partial vision",
      },
      {
        title: "Native Text-to-Speech",
        desc: "Uses the browser's built-in speechSynthesis API, taking advantage of potentially pre-installed high-quality voices on the user's device",
      },
    ],
    accessPoints: [
      { label: "Web App", url: "https://tavis-chem-scribe-lite.vercel.app/" },
      {
        label: "GitHub",
        url: "https://github.com/digi-lad/TAVIS_ChemScribe_Lite",
      },
    ],
    images: [
      {
        filename: "Interface (Touch to Capture)",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761228638/z7148606887016_a7aed02fce3d2b74370c7bd0ab70a7a7_b36hhq.jpg",
      },
      {
        filename: "Use demo",
        url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761228648/7148610251572_inbp4n.mp4",
      },
    ] as Array<{ filename: string; url: string }>,
  },
  digiLQD: {
    name: "digiLQD - Digital Le Quy Don",
    type: "Web Application",
    status: "COMPLETED" as const,
    timeframe: "2025",
    bootSequence:
      "A platform made for Le Quy Don Highschool for the Gifted that provides real-time tracking of disciplinary data (demerits & merits) of 1200+ students from 39 classes, significantly improving data transparency and convenience.",
    sysSpecs: [
      "Google Apps Script (JavaScript)",
      "HTML with CSS",
      "Google Sheets as Database",
    ],
    buildLog: [
      {
        title: "Detailed De(merit) List",
        desc: "Built a list to show all de(merits) up to date, with filters by timestamp (week) and class.",
      },
      {
        title: "Class Analysis",
        desc: "Built a dedicated board to show individual classes' average scores and score graphs.",
      },
      {
        title: "Real-time Ranking",
        desc: "Built a leaderboard that updates in real-time as any modification is noted.",
      },
    ],
    accessPoints: [
      {
        label: "Web App",
        url: "https://script.google.com/macros/s/AKfycby7onU248DPGKYGql3z4jfpvGL_UidhtD_nnYGSwLye7-H9AchugtPom9RA-TWGujwCNg/exec",
      },
      { label: "Github", url: "#" },
    ],
    images: [
      {
        filename: "Class Analysis",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761147547/Screenshot_2025-10-22_223845_vr36if.png",
      },
      {
        filename: "Detailed De(merit) List",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761147548/Screenshot_2025-10-22_223824_d3dv2h.png",
      },
      {
        filename: "Leaderboard",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761147548/Screenshot_2025-10-22_223850_cgwk6t.png",
      },
    ] as Array<{ filename: string; url: string }>,
  },
  digiHere: {
    name: "digiHere - Attendance Tracker",
    type: "Web Application",
    status: "COMPLETED" as const,
    timeframe: "2025",
    bootSequence:
      "A lightweight, frontend-only web application designed for efficient attendance tracking. Developed during a national olympiad training programme to address the need for fast and accurate daily attendance checks for 100+ students traveling between dorms and school buses.",
    sysSpecs: [
      "HTML5, Tailwind CSS, JavaScript for Frontend",
      "qrcodejs and jsQR libraries for QR generation/scanning",
      "Vercel for hosting",
    ],
    buildLog: [
      {
        title: "Fast Check In w/ QR",
        desc: "Generate unique QR codes for each person. Instantly mark attendance by scanning QR codes using the device's camera.",
      },
      {
        title: "Support Manual Checkin",
        desc: "Attendees can be checked in manually with single taps.",
      },
      {
        title: "Fast Exporting",
        desc: "Allows downloading QR codes individually or in bulk and exporting the attendance list to a CSV file.",
      },
    ],
    accessPoints: [
      { label: "Web App", url: "https://digi-here.vercel.app/" },
      { label: "Github", url: "https://github.com/digi-lad/digiHere" },
    ],
    images: [
      {
        filename: "Interface",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761206909/Screenshot_2025-10-23_150738_edyedm.png",
      },
      {
        filename: "Basic functions",
        url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761206891/7147301907198_coxem6.mp4",
      },
      {
        filename: "QR Scanning",
        url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761206882/7147299541997_i2rzpn.mp4",
      },
    ] as Array<{ filename: string; url: string }>,
  },
  digiCherish: {
    name: "digiCherish - A Warm Gift",
    type: "Wep Application",
    status: "COMPLETED" as const,
    timeframe: "2025",
    bootSequence:
      "A warm and delightful story designed to celebrate Vietnamese Women's Day. It takes users on a short, whimsical journey through a magical garden where their choices in a cute, narrative quiz lead them to discover a special crystal gift. The experience is designed to be relaxing and personal.",
    sysSpecs: [
      "HTML5 with Tailwind CSS",
      "Vanilla JavaScript for functionality",
    ],
    buildLog: [
      {
        title: "Interactive Narrative",
        desc: "A branching, story-driven quiz where each choice feels like part of a magical adventure.",
      },
      {
        title: "Visual Choices",
        desc: "Each option is presented as a card with a unique image and text to enhance immersion.",
      },
      {
        title: "Personalized Result",
        desc: "The final crystal gift is determined by the user's unique path through the story, providing a result that fits their choices.",
      },
    ],
    accessPoints: [
      { label: "Web App", url: "https://digi-cherish.vercel.app/" },
      { label: "Github", url: "https://github.com/digi-lad/digiCherish" },
    ],
    images: [
      {
        filename: "Interface",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761201251/z7146974878675_02dcd3158ad772a1c388957ae9b68475_scmbch.jpg",
      },
      {
        filename: "Rose Quartz",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761201241/z7146921731199_b1f26b58f78087c13e3218dbd206168b_yhjdbq.jpg",
      },
      {
        filename: "Peridot",
        url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761200003/z7146921729946_c437e1bad544d222df5f41d80c3c0cc2_ovvk6z.jpg",
      },
    ] as Array<{ filename: string; url: string }>,
  },
};