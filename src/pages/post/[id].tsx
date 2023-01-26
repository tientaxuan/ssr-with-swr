import React from 'react';
import { SWRConfig, unstable_serialize } from 'swr';
import useAPost from '@/hooks/useAPost';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context?.params?.id;
    const data = await axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.data);

    return {
      props: {
        fallback: {
          [unstable_serialize([
            'https://jsonplaceholder.typicode.com/posts',
            id,
          ])]: data,
        },
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

const SSRWithSWR = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const fallback = props.fallback;
  return (
    <SWRConfig value={{ fallback }}>
      <APostHead />
      <APostBody />
    </SWRConfig>
  );
};

const APostHead = (): JSX.Element => {
  const router = useRouter();
  const postId = router.query?.id;
  const { data } = useAPost(postId as string);
  return (
    <Head>
      <title>{data?.title}</title>
    </Head>
  );
};

const APostBody = (): JSX.Element => {
  const router = useRouter();
  const postId = router.query?.id;
  const { data } = useAPost(postId as string);
  return <div>{data?.body}</div>;
};

export default SSRWithSWR;
