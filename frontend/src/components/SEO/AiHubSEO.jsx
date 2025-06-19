import { Helmet } from 'react-helmet-async';

const AiHubSEO = () => {
  return (
    <Helmet>
      <title>BuildEstate - Market Trends & Property Analysis</title>
      <meta name="description" content="Analyze real estate trends, compare property values, and get location-specific investment insights." />
      <meta name="keywords" content="property analysis, real estate trends, property investment, rental yield, location trends, property appreciation, Mumbai real estate data, Delhi property market, Bangalore housing trends" />
      
      {/* Enhanced social sharing */}
      <meta property="og:title" content="BuildEstate" />
      <meta property="og:description" content="Powered property analysis and location trends for smarter real estate decisions." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://buildestate.vercel.app" />
      
      {/* Local availability note for crawlers */}
      <meta name="robots" content="index, follow" />
      <meta name="availability" content="Demo features available in local environment. Download repository for full functionality." />
    </Helmet>
  );
};

export default AiHubSEO;