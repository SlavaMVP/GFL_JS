import { useEffect, useState } from "react";

import apiService from "services/planets";

const useCharacter = (id) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const info = await apiService
          .getCharacter(id)
          .then((res) => res.json());

        setInfo(info);
      } catch {}
    })();
  }, [id]);

  return info;
};

export default useCharacter;
