import { fetchWithCredentials } from './fetches';

export const downloadBlobFile = async (id: string, filename?: string) => {
  const file = await fetchWithCredentials(
    `/api/v1/namespaces/default/data/${id}/blob`
  );
  const blob = await file.blob();
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  if (filename) {
    link.download = filename;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
