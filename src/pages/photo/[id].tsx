import React from 'react';
import { SWRConfig, unstable_serialize } from 'swr';
import useAPhoto from '@/hooks/useAPhoto';
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import type { APhoto } from '@/hooks/useAPhoto';

export const getStaticPaths: GetStaticPaths = async () => {
  const photos = (await axios
    .get(`https://jsonplaceholder.typicode.com/photos`)
    .then((res) => res.data)) as APhoto[];

  const paths = photos.slice(0, 100).map((item) => ({
    params: { id: item?.id?.toString() ?? '0' },
  }));

  console.log(paths);

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const id = context?.params?.id;
    const data = await axios
      .get(`https://jsonplaceholder.typicode.com/photos/${id}`)
      .then((res) => res.data);

    return {
      props: {
        fallback: {
          [unstable_serialize([
            'https://jsonplaceholder.typicode.com/photos',
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

const SSRWithSWR = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
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
  const photoId = router.query?.id;
  const { data } = useAPhoto(photoId as string);
  return (
    <Head>
      <title>{data?.title}</title>
      <link rel='icon' href={data?.thumbnailUrl ?? ''} />
    </Head>
  );
};

const APostBody = (): JSX.Element => {
  const router = useRouter();
  const postId = router.query?.id;
  const { data } = useAPhoto(postId as string);
  return (
    <div>
      <Image
        src={data?.url ?? ''}
        alt={data?.title ?? ''}
        width={150}
        height={150}
      />
    </div>
  );
};

export default SSRWithSWR;
