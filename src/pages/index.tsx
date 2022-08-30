import { GetStaticProps } from 'next';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import { FiUser, FiCalendar } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={commonStyles.main}>
        <div className={styles.posts}>

          {postsPagination.results.map(post => (
            <Link href={`/posts/${post.uid}`}>
              <a key={post.uid}>
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>
                <span>
                  <i><FiCalendar /></i> <time>{post.first_publication_date}</time>
                  <i><FiUser /></i> {post.data.author}
                </span>
              </a>
            </Link>
          ))}
        </div>

        {postsPagination.next_page !== null && (
          <span className={styles.loadMore}>Carregar mais posts</span>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 2,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date, //TODO tratar o resultado,
      data: {
        title: post.data.title[0].text,
        subtitle: post.data.subtitle[0].text,
        author: post.data.author[0].text,
      }
    }
  })

  return {
    props: { postsPagination: {
      next_page: postsResponse.next_page,
      results: posts,
    } }
  }
};
