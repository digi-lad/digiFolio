export type Tag = "National" | "Sub-national" | "Provincial" | "International";

export interface Achievement {
  title: string;
  awardedBy?: string;
  tag: Tag;
  highlighted?: boolean;
}

export interface MonthlyAchievements {
  [month: string]: Achievement[];
}

export interface YearlyAchievements {
  [year: string]: MonthlyAchievements;
}

export const ACHIEVEMENTS_DATA: YearlyAchievements = {
  "2025": {
    Sep: [
      {
        title: "Silver Medal, Vietnam Artificial Intelligence Championship",
        awardedBy:
          "AI4LIFE Institute, Hanoi University of Science and Technology",
        tag: "National",
        highlighted: true,
      },
    ],
    Aug: [
      {
        title: "Odon Vallet Fellowship",
        awardedBy: "RVN-Vallet Fund, Rencontres du Vietnam",
        tag: "National",
      },
      {
        title: "Distinction (ranked 6th), Australian Mathematics Competition",
        awardedBy: "Australian Math Trust",
        tag: "International",
      },
    ],
    Apr: [
      {
        title: "Gold Medal, 29th Southern Vietnam Olympiad in Informatics",
        tag: "Sub-national",
      },
    ],
    Jan: [
      {
        title: "Second Award, Vietnamese Olympiad in Informatics",
        awardedBy: "The Ministry of Education and Training, Vietnam",
        tag: "National",
        highlighted: true,
      },
    ],
  },
  "2024": {
    Oct: [
      {
        title:
          "First Award, Ba Ria-Vung Tau Provincial Olympiad in Informatics",
        tag: "Provincial",
        awardedBy: "The Department of Education & Training, Ba Ria-Vung Tau",
      },
    ],
    Apr: [
      {
        title: "Gold Medal, 28th Southern Vietnam Olympiad in Informatics",
        tag: "Sub-national",
      },
    ],
    Mar: [
      {
        title:
          "Second Award, Ba Ria-Vung Tau Provincial Olympiad in Informatics",
        awardedBy: "The Department of Education & Training, Ba Ria-Vung Tau",
        tag: "Provincial",
      },
    ],
  },
  "2023": {
    Aug: [
      {
        title: "Finalist, Vietnam National Youth Informatics Contest",
        awardedBy: "Center for Vietnam Young Talents, Science and Tech",
        tag: "National",
        highlighted: true,
      },
    ],
    Jun: [
      {
        title:
          "Valedictorian (Top-scorer), Entrance Exam to Le Quy Don High School for the Gifted",
        tag: "Provincial",
      },
    ],
    Mar: [
      {
        title:
          "Second Award, Ba Ria-Vung Tau Provincial Olympiad in Informatics",
        awardedBy: "The Department of Education & Training, Ba Ria-Vung Tau",
        tag: "Provincial",
      },
    ],
  },
};
