import useSWR, { Fetcher, Key } from 'swr';
import axios from 'axios';

type KeyType = (string | undefined)[];

export interface APhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const fetcher: Fetcher<APhoto, KeyType> = async ([url, photoId]) => {
  return axios.get(`${url}/${photoId}`).then((res) => res.data);
};

const useAPhoto = (photoId: string | undefined) => {
  return useSWR(
    ['https://jsonplaceholder.typicode.com/photos', photoId],
    fetcher,
  );
};

export default useAPhoto;
