

export const fetchData = async (url: string) => {
    const res = await fetch(url);
    const response = await res.json();
    return response;
  };