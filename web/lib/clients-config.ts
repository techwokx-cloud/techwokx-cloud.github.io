export interface Client {
  id: string;
  name: string;
  logo?: string; // Path to logo image in /public/clients/
  url: string;
  description?: string;
}

export const clients: Client[] = [
  {
    id: "zara-kitchen",
    name: "Zara Kitchen",
    logo: "/clients/zara-kitchen.jpg",
    url: "https://zarakitchengh.com",
    description: "Restaurant & catering services",
  },
  {
    id: "mbl-ntc",
    name: "MBL-NTL SulNOxEco",
    logo: "/clients/MBL-NTC.png",
    url: "#",
    description: "Fuel conditioner distribution",
  },
  {
    id: "hands-fresh",
    name: "HandFresh",
    logo: "/clients/Hands-fresh.png",
    url: "https://handsfresh.techwokx.online",
    description: "E-commerce platform",
  },
  {
    id: "gladys-foundation",
    name: "Gladys Aforo Foundation",
    logo: "/clients/GladysAforo-Foundation.png",
    url: "#",
    description: "Community foundation",
  },
  {
    id: "dewbyaphia",
    name: "Dewbyaphia",
    logo: "/clients/dewbyaphia.jpg",
    url: "#",
    description: "Creative services",
  },
];
