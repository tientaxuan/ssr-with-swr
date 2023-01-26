import useSWR, { Fetcher, Key } from 'swr';
import axios from 'axios';

type KeyType = (string | undefined)[];

interface APost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const fetcher: Fetcher<APost, KeyType> = async ([url, postId]) => {
  return axios.get(`${url}/${postId}`).then((res) => res.data);
};

const useAPost = (postId: string | undefined) => {
  return useSWR(
    ['https://jsonplaceholder.typicode.com/posts', postId],
    fetcher,
  );
};

export default useAPost;
