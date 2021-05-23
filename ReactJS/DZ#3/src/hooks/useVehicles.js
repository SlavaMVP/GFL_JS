import { useEffect, useState } from "react";

import apiService from "services/movies";

const useVehicles = (id) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const info = await apiService.getVehicle(id).then((res) => res.json());

        setInfo(info);
      } catch {}
    })();
  }, [id]);

  return info;
};

export default useVehicles;
