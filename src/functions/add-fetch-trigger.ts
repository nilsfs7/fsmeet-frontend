// adds a timestamp as query param -> triggers refetching data
export function addFetchTrigger(url: string): string {
  url = `${url}?ts=${new Date().getTime()}`;
  return url;
}
