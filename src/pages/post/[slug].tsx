import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps) {

  // useEffect(() => {
  //   const body = post.data.content.reduce((acc, cur) => {
  //     acc.push(cur.body);

  //     return acc;
  //   }, []);

  //   console.log(body);

  //   const treatedBody = []; 
  //   body.forEach(group => {
  //     group.forEach(p => {
  //       p === "" && treatedBody.push(p)
  //     })
  //   })

  //   console.log(treatedBody)

  // }, [])

  function wordCount() {
    let groupsArray = post.data.content.map(group => {
      return group.body;
    })

    console.log(groupsArray)

    // const paragraphsArray = groupsArray.reduce((acc, curr) => {

    // }, [])

    return '4 min'
  }
  

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <img className={styles.image} src={post.data.banner.url} alt="" />
      <main className={styles.main}>
        <header>
          <h1>{post.data.title}</h1>
          <p>
            <span><i><FiCalendar /></i> <time>{post.first_publication_date}</time></span>
            <span><i><FiUser /></i> {post.data.author}</span>
            <span><i><FiClock /></i> {wordCount()}</span>
          </p>
        </header>

        <article>
          {post.data.content.map((hit, index) => (
            <section key={index}>
              <strong>{hit?.heading}</strong>
              {hit.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');
  
  const slugs = posts.results.map(hit => {
    return `/post/${hit.slugs[0]}`
  })
    
  return {
    paths: slugs,
    fallback: true,
  }
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', slug);

  const post = {
    first_publication_date: format(new Date(response.first_publication_date), 'PP', { locale: ptBR }),
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      },
      author: RichText.asText(response.data.author),
      content: response.data.group.map(hit => {
        return {
          heading: hit.heading[0]?.text ?? ' ',
          body: hit.body.map(hit => (
            hit.text
          )),
        };
      })
    },
  }

  return {
    props: {
      post,
    }
  }
};
