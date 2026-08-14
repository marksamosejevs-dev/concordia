export interface Service {
  number: string;
  title: string[];
  summary: string;
  items: string[];
}

export const services: Service[] = [
  {
    number: "01",
    title: ["Player", "Representation"],
    summary: "Strategic representation across transfers, contracts and career decisions.",
    items: [
      "Transfers",
      "Contract negotiations",
      "Career strategy",
      "Club relations",
      "International opportunities",
      "Player development strategy",
    ],
  },
  {
    number: "02",
    title: ["Legal"],
    summary: "Legal expertise embedded in every football decision.",
    items: [
      "Player contracts",
      "Transfer agreements",
      "Employment law",
      "FIFA regulations",
      "Football disputes",
      "Image rights",
      "Immigration",
      "International career matters",
      "CAS / football tribunal matters",
    ],
  },
  {
    number: "03",
    title: ["Career &", "Financial Strategy"],
    summary: "Long-term planning and financial coordination around the career.",
    items: [
      "Long-term career planning",
      "Financial coordination",
      "Investment advisory coordination",
      "Asset-structuring coordination",
      "Post-career planning",
    ],
  },
  {
    number: "04",
    title: ["Commercial"],
    summary: "Building the player's brand and commercial opportunities.",
    items: [
      "Sponsorships",
      "Brand partnerships",
      "Image rights",
      "Commercial opportunities",
      "Personal brand development",
      "Social-media strategy",
    ],
  },
  {
    number: "05",
    title: ["Concierge"],
    summary: "The player focuses on football. Concordia manages the complexity around the career.",
    items: [
      "Relocation",
      "Housing",
      "Travel",
      "Family support",
      "Medical coordination",
      "Lifestyle support",
    ],
  },
  {
    number: "06",
    title: ["Football &", "Club Services"],
    summary: "Coordination across the wider football industry.",
    items: [
      "Training camps",
      "Friendly matches",
      "International tournaments",
      "Club advisory",
      "Football-industry coordination",
    ],
  },
];
