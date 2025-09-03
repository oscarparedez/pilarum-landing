import type { FC } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const Seo: FC<SeoProps> = (props) => {
  const { 
    title, 
    description = 'Plataforma de gestión de obras industriales',
    image = 'https://pilarum.com/assets/logo.png',
    url
  } = props;

  const fullTitle = title ? title + ' | Pilarum' : 'Pilarum';

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta
        name="description"
        content={description}
      />
      
      {/* Open Graph Meta Tags */}
      <meta
        property="og:title"
        content={fullTitle}
      />
      <meta
        property="og:description"
        content={description}
      />
      <meta
        property="og:image"
        content={image}
      />
      <meta
        property="og:image:type"
        content="image/png"
      />
      <meta
        property="og:image:alt"
        content="Pilarum Logo"
      />
      {url && (
        <meta
          property="og:url"
          content={url}
        />
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta
        name="twitter:title"
        content={fullTitle}
      />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={image}
      />
    </Head>
  );
};

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
};
