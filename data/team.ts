export interface TeamMember {
  id: string;
  name: string;
  title: string;
  /** Path relative to /public, e.g. /team/slug.jpg — placeholder is shown until the real file exists at this path */
  photo: string;
}

export const team: TeamMember[] = [
  {
    id: "marks-amosejevs",
    name: "Marks Amosejevs",
    title: "Co-Founder & FIFA Licensed Football Agent",
    photo: "/team/marks-amosejevs.jpg",
  },
];
