export interface TeamMember {
  id: string;
  name: string;
  title: string;
  /** Path relative to /public, e.g. /team/slug.jpg — placeholder is shown until the real file exists at this path */
  photo: string;
  /** e.g. FIFA license number, omitted when not applicable */
  credential?: string;
  /** Path relative to /public to a license/credential image, omitted when not applicable */
  licenseImage?: string;
}

export const team: TeamMember[] = [
  {
    id: "marks-amosejevs",
    name: "Marks Amosejevs",
    title: "Co-Founder & FIFA Licensed Football Agent",
    photo: "/team/marks-amosejevs.jpg",
    credential: "FIFA Football Agent License No. 202406-7079",
    licenseImage: "/team/marks-fifa-license.png",
  },
];
