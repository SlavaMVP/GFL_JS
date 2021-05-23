import { useEffect, useState } from "react";

import apiService from "services/movies";

const useSparships = (id) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const info = await apiService.getStarship(id).then((res) => res.json());

        setInfo(info);
      } catch {}
    })();
  }, [id]);

  return info;
};

export default useSparships;
