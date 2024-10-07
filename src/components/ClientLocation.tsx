"use client";

import { useEffect, useState } from "react";

export default function ClientLocation() {
  const [location, setLocation] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    (async function () {
      const fetchIp = await fetch("https://api.ipify.org/?format=json");
      const { ip } = await fetchIp.json();

      const response = await fetch(`https://ipapi.co/${ip}/json`);
      const data = await response.json();

      setLocation({
        city: data.city,
        region: data.region,
        country: data.country_name,
      });
    })();
  }, []);

  return (
    location &&
    Object.entries(location).map(([key, value], index) => (
      <span key={key} className="text-blue-400">
        {value}
        {index < Object.keys(location).length - 1 && ","}
      </span>
    ))
  );
}
