import { useEffect, useState } from 'react';

export interface UrlItemDTO {
  url: string;
  delay: number;
}

function useUrls() {
  const [urls, setUrls] = useState<UrlItemDTO[]>([]);

  function addUrl(newUrl: UrlItemDTO) {
    setUrls((prevState) => {
      return [
        ...prevState,
        newUrl
      ];
    });
  }

  async function getUrlsFromStorage() {
    const existed = (await chrome.storage.local.get('urls'))?.urls as UrlItemDTO[];

    if (existed) {
      setUrls(existed);
    }
  }

  async function setUrlsToStorage() {
    await chrome.storage.local.set({ urls });
  }

  useEffect(() => {
    setUrlsToStorage();
  }, [urls]);

  useEffect(() => {
    getUrlsFromStorage();
  }, []);

  return {
    urls,
    addUrl,
    getUrlsFromStorage,
    setUrlsToStorage,
  };
}

export default useUrls;