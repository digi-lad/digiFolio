import React from "react";
import { DesktopIcon } from "../components/DesktopIcon";
import { ImageLogGrid } from "../components/ImageLogGrid";
import { imageLogData } from "../components/ImageLogWidget";
import { AchievementTimeline } from "../components/AchievementTimeline";
import { ProjectDetail } from "../components/ProjectDetail";
import { ProjectShowcase } from "../components/ProjectShowcase";
import { ResearchPaper } from "../components/ResearchPaper";
import { OperatorDossier } from "../components/OperatorDossier";
import { OperatorAssistantContent } from "../components/OperatorAssistantContent";
import { SecureComms } from "../components/SecureComms";
import { ShortestPathGame } from "../components/ShortestPathGame";
import { PROFILE_DATA } from "../helpers/profileData";
import { ACHIEVEMENTS_DATA } from "../helpers/achievementsData";
import { CONTACT_CHANNELS } from "../helpers/contactData";
import { ICON_URLS } from "./iconUrls";
import { FOLDER_CONTENTS } from "./folderContents";
import { PROJECT_DATA } from "./projectsData";
import { LEADERSHIP_PROJECTS_DATA } from "./leadershipProjectsData";

// ============================================================================
// WINDOW IDS - All possible window identifiers
// ============================================================================
export type WindowId =
  | "PROJECT_ARCHIVES"
  | "LEADERSHIP_OPS"
  | "AGENT_PROFILE"
  | "ACHIEVEMENTS"
  | "SECURE_COMMS"
  | "OPERATOR_ASSISTANT"
  | "ALGORITHM_SANDBOX"
  | "IMAGE_LOG"
  | "ScamDetector"
  | "GNN_Vulnerability"
  | "TAVIS_SciLens"
  | "digiLQD"
  | "digiHere"
  | "digiCherish"
  | "Student_Council"
  | "The_Algitect"
  | "Green_Vietnam"
  | "Traditional_Camp"
  | "Club_Fair"
  | "Prom";

// ============================================================================
// INTERFACES
// ============================================================================
export interface WindowConfig {
  id: WindowId;
  title: string;
  iconId?: string;
  customIconUrl?: string;
  content: React.FC<{ openWindow: (id: WindowId) => void }>;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex?: number;
}

export interface DesktopIconConfig {
  id: string;
  label: string;
  type?: "file" | "folder";
  icon: React.ComponentType<any> | string;
  externalUrl?: string;
}

// ============================================================================
// WINDOWS CONFIGURATION
// ============================================================================
const windows: Record<WindowId, WindowConfig> = {
  PROJECT_ARCHIVES: {
    id: "PROJECT_ARCHIVES",
    title: "PROJECT_ARCHIVES",
    content: ({ openWindow }) => (
      <div
        style={{ display: "flex", gap: "var(--spacing-6)", flexWrap: "wrap" }}
      >
        {FOLDER_CONTENTS.PROJECT_ARCHIVES.map((file) => (
          <DesktopIcon
            key={file.id}
            icon={ICON_URLS.file as any}
            label={file.label}
            onClick={() => openWindow(file.id as WindowId)}
          />
        ))}
      </div>
    ),
    initialPosition: { x: 200, y: 50 },
    initialSize: { width: 400, height: 400 },
  },
  LEADERSHIP_OPS: {
    id: "LEADERSHIP_OPS",
    title: "LEADERSHIP_OPS",
    content: ({ openWindow }) => (
      <div
        style={{ display: "flex", gap: "var(--spacing-6)", flexWrap: "wrap" }}
      >
        {FOLDER_CONTENTS.LEADERSHIP_OPS.map((file) => (
          <DesktopIcon
            key={file.id}
            icon={ICON_URLS.file as any}
            label={file.label}
            onClick={() => openWindow(file.id as WindowId)}
          />
        ))}
      </div>
    ),
    initialPosition: { x: 250, y: 100 },
    initialSize: { width: 400, height: 350 },
  },
  AGENT_PROFILE: {
    id: "AGENT_PROFILE",
    title: "Operator Dossier",
    content: () => (
      <OperatorDossier {...PROFILE_DATA} gallery={PROFILE_DATA.gallery} />
    ),
    initialPosition: { x: 300, y: 35 },
    initialSize: { width: 800, height: 610 },
  },
  ACHIEVEMENTS: {
    id: "ACHIEVEMENTS",
    title: "Honors and Awards",
    content: () => <AchievementTimeline achievementsData={ACHIEVEMENTS_DATA} />,
    initialPosition: { x: 200, y: 100 },
    initialSize: { width: 800, height: 600 },
  },
  SECURE_COMMS: {
    id: "SECURE_COMMS",
    title: "Contact",
    content: () => <SecureComms channels={CONTACT_CHANNELS} />,
    initialPosition: { x: 200, y: 150 },
    initialSize: { width: 800, height: 500 },
  },
  OPERATOR_ASSISTANT: {
    id: "OPERATOR_ASSISTANT",
    title: "OPERATOR ASSISTANT",
    iconId: "OPERATOR_ASSISTANT",
    content: () => <OperatorAssistantContent />,
    initialPosition: { x: 700, y: 200 },
    initialSize: { width: 400, height: 500 },
  },
  ALGORITHM_SANDBOX: {
    id: "ALGORITHM_SANDBOX",
    title: "ALGORITHM SANDBOX",
    iconId: "ALGORITHM_SANDBOX",
    content: () => <ShortestPathGame />,
    initialPosition: { x: 250, y: 80 },
    initialSize: { width: 900, height: 600 },
  },
  IMAGE_LOG: {
    id: "IMAGE_LOG",
    title: "IMAGE LOG",
    content: () => <ImageLogGrid images={imageLogData} />,
    initialPosition: { x: 300, y: 100 },
    initialSize: { width: 900, height: 600 },
  },
  ScamDetector: {
    id: "ScamDetector",
    title: "digiSecure",
    iconId: "ScamDetector",
    content: () => <ProjectShowcase {...PROJECT_DATA.ScamDetector} />,
    initialPosition: { x: 450, y: 100 },
    initialSize: { width: 1050, height: 600 },
  },
  GNN_Vulnerability: {
    id: "GNN_Vulnerability",
    title: "Research: Vulnerability of Graph Neural Networks",
    iconId: "GNN_Vulnerability",
    content: () => <ResearchPaper {...PROJECT_DATA.GNN_Vulnerability} />,
    initialPosition: { x: 500, y: 150 },
    initialSize: { width: 1050, height: 600 },
  },
  TAVIS_SciLens: {
    id: "TAVIS_SciLens",
    title: "TAVIS SciLens",
    iconId: "TAVIS_SciLens",
    content: () => <ProjectShowcase {...PROJECT_DATA.TAVIS_SciLens} />,
    initialPosition: { x: 400, y: 120 },
    initialSize: { width: 1050, height: 600 },
  },
  digiLQD: {
    id: "digiLQD",
    title: "digiLQD",
    iconId: "digiLQD",
    content: () => <ProjectShowcase {...PROJECT_DATA.digiLQD} />,
    initialPosition: { x: 420, y: 140 },
    initialSize: { width: 1050, height: 600 },
  },
  digiHere: {
    id: "digiHere",
    title: "digiHere",
    iconId: "digiHere",
    content: () => <ProjectShowcase {...PROJECT_DATA.digiHere} />,
    initialPosition: { x: 440, y: 160 },
    initialSize: { width: 1050, height: 600 },
  },
  digiCherish: {
    id: "digiCherish",
    title: "digiCherish",
    iconId: "digiCherish",
    content: () => <ProjectShowcase {...PROJECT_DATA.digiCherish} />,
    initialPosition: { x: 460, y: 180 },
    initialSize: { width: 1050, height: 600 },
  },
  Student_Council: {
    id: "Student_Council",
    title: "Le Quy Don's Student Council - President",
    iconId: "Student_Council",
    content: () => <ProjectDetail {...PROJECT_DATA.Student_Council} />,
    initialPosition: { x: 550, y: 200 },
    initialSize: { width: 900, height: 500 },
  },
  The_Algitect: {
    id: "The_Algitect",
    title: "The Algitect - Founder & President",
    iconId: "The_Algitect",
    content: () => <ProjectDetail {...PROJECT_DATA.The_Algitect} />,
    initialPosition: { x: 600, y: 250 },
    initialSize: { width: 900, height: 500 },
  },
  Green_Vietnam: {
    id: "Green_Vietnam",
    title: "Green Vietnam - Provincial Leader",
    iconId: "Green_Vietnam",
    content: () => <ProjectDetail {...PROJECT_DATA.Green_Vietnam} />,
    initialPosition: { x: 580, y: 220 },
    initialSize: { width: 900, height: 500 },
  },
  Traditional_Camp: {
    id: "Traditional_Camp",
    title: "Traditional Camp Day - Head Organizer",
    iconId: "Traditional_Camp",
    content: () => (
      <ProjectDetail {...LEADERSHIP_PROJECTS_DATA.Traditional_Camp} />
    ),
    initialPosition: { x: 350, y: 150 },
    initialSize: { width: 975, height: 550 },
  },
  Club_Fair: {
    id: "Club_Fair",
    title: "Club Fair - Head Organizer",
    iconId: "Club_Fair",
    content: () => <ProjectDetail {...LEADERSHIP_PROJECTS_DATA.Club_Fair} />,
    initialPosition: { x: 400, y: 180 },
    initialSize: { width: 975, height: 550 },
  },
  Prom: {
    id: "Prom",
    title: "Prom - Head Organizer",
    iconId: "Prom",
    content: () => <ProjectDetail {...LEADERSHIP_PROJECTS_DATA.Prom} />,
    initialPosition: { x: 450, y: 210 },
    initialSize: { width: 975, height: 550 },
  },
};

// ============================================================================
// DESKTOP ICONS
// ============================================================================
const desktopIcons: DesktopIconConfig[] = [
  {
    id: "PROJECT_ARCHIVES",
    label: "PROJECT\nARCHIVES",
    icon: ICON_URLS.folder as any,
  },
  {
    id: "LEADERSHIP_OPS",
    label: "LEADERSHIP\nOPS",
    icon: ICON_URLS.folder as any,
  },
  {
    id: "AGENT_PROFILE",
    label: "PROFILE.id",
    icon: ICON_URLS.profile as any,
  },
  {
    id: "ACHIEVEMENTS",
    label: "AWARDS.log",
    icon: ICON_URLS.achievements as any,
  },
  {
    id: "SECURE_COMMS",
    label: "COMMS.mail",
    icon: ICON_URLS.mail as any,
  },
  {
    id: "CV_LINK",
    label: "RESUME.pdf",
    icon: ICON_URLS.cv as any,
    externalUrl:
      "https://drive.google.com/file/d/1VT5y9VedovUcUyIwK6skPES53Tvs6JfX/view?usp=sharing",
  },
  {
    id: "ALGORITHM_SANDBOX",
    label: "ALGO.exe",
    icon: ICON_URLS.algorithm as any,
  },
];

// ============================================================================
// EXPORTS
// ============================================================================
export const portfolioData = {
  windows,
  desktopIcons,
};
