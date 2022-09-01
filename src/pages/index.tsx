import { GetStaticProps } from 'next';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import { FiUser, FiCalendar } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

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
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadMore() {
    await fetch(nextPage)
      .then(response => {
        return response.json();
      })
      .then(result => {
        const updatedPosts = [...posts];

        result.results.forEach(post => {
          updatedPosts.push({
            uid: post.uid,
            first_publication_date: format(new Date(post.first_publication_date), 'PP', { locale: ptBR }),
            data: {
              title: post.data.title[0].text,
              subtitle: post.data.subtitle[0].text,
              author: post.data.author[0].text,
            },
          });
        })
        setPosts(updatedPosts);
        setNextPage(result.next_page);
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={commonStyles.main}>
        <div className={styles.posts}>

          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
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

        {nextPage !== null && (
          <span className={styles.loadMore} onClick={handleLoadMore} >Carregar mais posts</span>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 4,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), "PP", { locale: ptBR }),
      data: {
        title: post.data.title[0].text,
        subtitle: post.data.subtitle[0].text,
        author: post.data.author[0].text,
      },
    };
  })

  return {
    props: { 
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
      revalidate: 60 * 60 * 24, //* 24 hours 
    }
  }
};
