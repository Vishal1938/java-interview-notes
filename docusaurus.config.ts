import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// ---------------------------------------------------------------------------
// 👉 Change these two values to match your GitHub account and repo name.
// ---------------------------------------------------------------------------
const GITHUB_USERNAME = 'Vishal1938';
const REPO_NAME = 'java-interview-notes';

// Netlify sets NETLIFY=true and URL (the site's address) during its builds.
// There the site is served from the domain root; elsewhere it uses GitHub Pages paths.
const IS_NETLIFY = process.env.NETLIFY === 'true';

const config: Config = {
  title: 'Java Interview Notes',
  tagline: 'Java interview questions explained with working code — my revision notes',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: IS_NETLIFY ? process.env.URL! : `https://${GITHUB_USERNAME}.github.io`,
  baseUrl: IS_NETLIFY ? '/' : `/${REPO_NAME}/`,
  organizationName: GITHUB_USERNAME,
  projectName: REPO_NAME,
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'questions',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: false,
          // No "Edit this page" link: readers only read; editing happens in /admin.
        },
        // Blog posts go to Medium / Dev.to, so the built-in blog is off.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/questions',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Java Interview Notes',
      logo: {
        alt: 'Java Interview Notes',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'questionsSidebar',
          position: 'left',
          label: 'Questions',
        },
        {
          href: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Topics',
          items: [
            {label: 'Core Java', to: '/questions/core-java'},
            {label: 'Collections', to: '/questions/collections'},
            {label: 'Multithreading', to: '/questions/multithreading'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Java 8+', to: '/questions/java8-features'},
            {label: 'Design Patterns', to: '/questions/design-patterns'},
            {label: 'Start here', to: '/questions'},
            {
              label: 'GitHub',
              href: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`,
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Java Interview Notes. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'properties', 'yaml'],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
