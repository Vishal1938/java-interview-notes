import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Add a new entry here when you create a new topic folder in /docs.
const TOPICS = [
  {
    title: 'Core Java',
    to: '/questions/core-java',
    description: 'OOP, String, equality, keywords, exceptions and JVM basics.',
  },
  {
    title: 'Collections',
    to: '/questions/collections',
    description: 'List, Set, Map internals and choosing the right one.',
  },
  {
    title: 'Multithreading',
    to: '/questions/multithreading',
    description: 'Threads, locks, volatile, executors and concurrency utilities.',
  },
  {
    title: 'Java 8+',
    to: '/questions/java8-features',
    description: 'Lambdas, streams, Optional and modern language features.',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className="container">
          <Heading as="h1" className={styles.title}>
            {siteConfig.title}
          </Heading>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/questions">
              Start revising →
            </Link>
          </div>
        </div>
      </header>

      <main className="container margin-vert--xl">
        <div className={styles.grid}>
          {TOPICS.map((t) => (
            <Link key={t.to} to={t.to} className={styles.card}>
              <Heading as="h3">{t.title}</Heading>
              <p>{t.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
