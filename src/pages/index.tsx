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

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={commonStyles.main}>
        <div className={styles.posts}>
          <Link href="/post/1">
            <a>
              <h2>Título do Post</h2>
              <p>Resumo do que fala o post de maneira geral somente para visualização</p>
              <span>
                <i><FiCalendar /></i> <time>19 Abr 2022</time>
                <i><FiUser /></i> Gabriel Albuquerque
              </span>
            </a>
          </Link>
          <Link href="/post/2">
            <a>
              <h2>Título do Post 2</h2>
              <p>Resumo do que fala o post de maneira geral somente para visualização</p>
              <span>
                <i><FiCalendar /></i> <time>13 Jun 2022</time>
                <i><FiUser /></i> Gabriel Albuquerque
              </span>
            </a>
          </Link>
          <Link href="/post/2">
            <a>
              <h2>Título do Post 3</h2>
              <p>Resumo do que fala o post de maneira geral somente para visualização</p>
              <span>
                <i><FiCalendar /></i> <time>09 Ago 2022</time>
                <i><FiUser /></i> Gabriel Albuquerque
              </span>
            </a>
          </Link>
        </div>
        <span className={styles.loadMore}>Carregar mais posts</span>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
