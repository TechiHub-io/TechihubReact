
import axios from "axios";
import useSWR from "swr";



const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.data.Applications);
const baseUrl = 'https://techihubjobsproject.azurewebsites.net';
export function Swrgetdat4(url: string) {
  const { data, error, isLoading } = useSWR(`${baseUrl}${url}`, fetcher); //, {refreshInterval: 3000}
  return {
    data: data,
    isLoading,
    error: error,
  };
}
