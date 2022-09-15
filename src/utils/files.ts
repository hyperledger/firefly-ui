import { fetchWithCredentials } from './fetches';

export const downloadBlobFile = async (
  id: string,
  namespace: string,
  filename?: string
) => {
  const file = await fetchWithCredentials(
    `/api/v1/namespaces/${namespace}/data/${id}/blob`
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

export const downloadJsonString = async (
  jsonString: string,
  filename: string
) => {
  const blob = new Blob([jsonString], {
    type: 'application/json',
  });
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

export const downloadExternalFile = async (url: string, filename?: string) => {
  const file = await fetch(url);
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
