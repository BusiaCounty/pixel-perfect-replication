import { MapPin } from "lucide-react";

const subcounties = [
  { name: "Kisauni", wards: ["Mjambere", "Junda", "Bamburi", "Mwakirunge", "Mtopanga", "Magogoni"], projects: 28 },
  { name: "Mvita", wards: ["Tudor", "Majengo", "Tononoka", "Ganjoni", "Shimanzi"], projects: 22 },
  { name: "Likoni", wards: ["Timbwani", "Shika Adabu", "Bofu", "Mtongwe"], projects: 18 },
  { name: "Changamwe", wards: ["Kipevu", "Port Reitz", "Airport", "Chaani", "Jomvu Kuu"], projects: 24 },
  { name: "Jomvu", wards: ["Mikindani", "Miritini", "Jomvu"], projects: 15 },
  { name: "Nyali", wards: ["Frere Town", "Ziwa La Ngombe", "Mkomani", "Kongowea", "Kadzandani"], projects: 20 },
];

const LocationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Locations</h1>
        <p className="text-sm text-muted-foreground">Geographic breakdown of projects by subcounty and ward</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {subcounties.map((sc) => (
          <div key={sc.name} className="rounded-xl border bg-card p-5 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-secondary" />
              <h3 className="font-bold text-foreground">{sc.name}</h3>
              <span className="ml-auto text-xs text-muted-foreground">{sc.projects} projects</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sc.wards.map((w) => (
                <span key={w} className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">{w}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsPage;
