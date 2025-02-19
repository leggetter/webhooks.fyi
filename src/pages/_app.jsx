import Head from 'next/head'
import { useRouter } from "next/router";
import { slugifyWithCounter } from '@sindresorhus/slugify'

import { Layout } from '@/components/Layout'

import 'focus-visible'
import '@/styles/tailwind.css'

const navigation = [
  {
    title: 'Intro',
    links: [
      { title: 'Overview', href: '/' },
      { title: 'What are webhooks?', href: '/docs/webhook-primer' },
    ],
  },
  {
    title: 'Webhook Directory',
    links: [
      { title: 'All providers by name' , href: '/docs/webhook-directory' },
    ],
  },
  {
    title: 'Webhook Security',
    links: [
      { title: 'Introduction', href: '/security/intro' },
      { title: 'One Time Verification', href: '/security/one-time-verification-challenge' },
      { title: 'Shared Secret', href: '/security/shared-secret' },
      { title: 'HMAC', href: '/security/hmac' },
      { title: 'Asymmetric Keys', href: '/security/asymmetric-key-signatures' },
      { title: 'OAuth2, JWTs, and JWKs', href: '/security/jwt-jwk-oauth2' },
      { title: 'mTLS', href: '/security/end-to-end-encryption' },
      { title: 'Dataless notifications', href: '/security/dataless-notifications' },
      { title: 'Replay prevention', href: '/security/replay-prevention' },
    ],
  },
  {
    title: 'Operational Experience',
    links: [
      { title: 'Introduction', href: '/ops-experience/intro' },
      { title: 'Resiliency', href: '/ops-experience/resiliency' },
      { title: 'Forward Compatibility', href: '/ops-experience/versioning' },
      { title: 'Zero Downtime Rotation', href: '/ops-experience/key-rotation' },
      { title: 'Multiple URLs', href: '/ops-experience/multiple-urls' },
      { title: 'Documentation', href: '/ops-experience/documentation' },
    ],
  },
  {
    title: 'Best Practices',
    links: [
      { title: 'For Providers', href: '/best-practices/webhook-providers' },
      { title: 'For Consumers', href: '/best-practices/webhook-consumers' },
    ],
  },
  {
    title: 'Learn More',
    links: [
      { title: 'Standardization Efforts', href: '/learn-more/standards' },
      { title: 'Additional Resources', href: '/learn-more/resources' },
    ],
  },
  {
    title: 'Contributing',
    links: [
      { title: 'How to contribute', href: '/docs/how-to-contribute' },
    ],
  },
]

function getNodeText(node) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function collectHeadings(nodes, slugify = slugifyWithCounter()) {
  let sections = []

  for (let node of nodes) {
    if (/^h[23]$/.test(node.name)) {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        node.attributes.id = id
        if (node.name === 'h3') {
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          sections.push({ ...node.attributes, title, children: [] })
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = (`https://webhooks.fyi` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
  
  let title = pageProps.markdoc?.frontmatter.title

  let pageTitle =
    pageProps.markdoc?.frontmatter.pageTitle ||
    `${pageProps.markdoc?.frontmatter.title} - Docs`

  let description = pageProps.markdoc?.frontmatter.description

  let tableOfContents = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc.content)
    : []

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta property="og:url" content="https://webhooks.fyi/" />
        <meta property="og:title" content={pageTitle} />
        <meta name="og:image" property="og:image" content="/banner.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://webhooks.fyi/banner.png" />
      </Head>
      <Layout
        navigation={navigation}
        title={title}
        tableOfContents={tableOfContents}
      >
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
