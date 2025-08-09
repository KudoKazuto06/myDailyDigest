import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';

const app = express();
const parser = new Parser();

app.use(cors());

const VNEXPRESS_BASE_URL = 'https://vnexpress.net/rss';
const PAGE_SIZE = 10;

const CATEGORY_MAP_VNEXPRESS = {
  'tin-moi-nhat': 'tin-moi-nhat.rss',
  'the-gioi': 'the-gioi.rss',
  'kinh-doanh': 'kinh-doanh.rss',
  'the-thao': 'the-thao.rss',
  'giai-tri': 'giai-tri.rss',
  'du-lich': 'du-lich.rss',
  'doi-song': 'doi-song.rss',
  'giao-duc': 'giao-duc.rss',
  'suc-khoe': 'suc-khoe.rss',
  'so-hoa': 'so-hoa.rss',
};

app.get('/vnexpress', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || 'tin-moi-nhat';
  const rssPath = CATEGORY_MAP_VNEXPRESS[category] || 'tin-moi-nhat.rss';
  const rssUrl = `${VNEXPRESS_BASE_URL}/${rssPath}`;

  try {
    const feed = await parser.parseURL(rssUrl);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedItems = feed.items.slice(startIndex, endIndex).map(item => {
      const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet || '',
        imageUrl: imageMatch ? imageMatch[1] : null,
      };
    });

    res.json(paginatedItems);
  } catch (err) {
    console.error('Error fetching VnExpress RSS:', err.message);
    res.status(500).json({ error: 'Failed to fetch VnExpress news.' });
  }
});

const CATEGORY_MAP_KENH14 = {
  // Existing categories...
  'kenh14-star': 'https://kenh14.vn/star.rss',
  'kenh14-musik': 'https://kenh14.vn/musik.rss',
  'kenh14-cine': 'https://kenh14.vn/cine.rss',
  'kenh14-tvshow': 'https://kenh14.vn/tvshow.rss',
  'kenh14-beauty-fashion': 'https://kenh14.vn/beauty-fashion.rss',
  'kenh14-life': 'https://kenh14.vn/doi-song.rss',
  'kenh14-society': 'https://kenh14.vn/xa-hoi.rss',
  'kenh14-international': 'https://kenh14.vn/the-gioi-do-day.rss',
  'kenh14-health': 'https://kenh14.vn/suc-khoe.rss',
  'kenh14-eat-travel': 'https://kenh14.vn/an-quay-di.rss',
  'kenh14-sport': 'https://kenh14.vn/sport.rss',
  'kenh14-tek-life': 'https://kenh14.vn/tek-life.rss',
  'kenh14-school': 'https://kenh14.vn/hoc-duong.rss',
  'kenh14-watch-buy': 'https://kenh14.vn/xem-mua-luon.rss',
};

app.get('/kenh14', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || 'kenh14-star';
  const rssUrl = CATEGORY_MAP_KENH14[category];

  try {
    const feed = await parser.parseURL(rssUrl);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedItems = feed.items.slice(startIndex, endIndex).map(item => {
      const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet || '',
        imageUrl: imageMatch ? imageMatch[1] : null,
      };
    });

    res.json(paginatedItems);
  } catch (err) {
    console.error('Error fetching Kenh14 RSS:', err.message);
    res.status(500).json({ error: 'Failed to fetch Kenh14 news.' });
  }
});

const CATEGORY_MAP_ET = {
  'et-news': 'https://www.etonline.com/news/rss',
  'et-photos': 'https://www.etonline.com/photos/rss',
  'et-videos': 'https://www.etonline.com/videos/rss',
  'et-tv': 'https://www.etonline.com/tv/rss',
  'et-style': 'https://www.etonline.com/style/rss',
  'et-fashion': 'https://www.etonline.com/fashion/rss',
  'et-lifestyle': 'https://www.etonline.com/lifestyle/rss',
  'et-shopping': 'https://www.etonline.com/shopping/rss',
  'et-music': 'https://www.etonline.com/music/rss',
  'et-movies': 'https://www.etonline.com/movies/rss',
};

app.get('/etonline', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || 'et-news';
  const rssUrl = CATEGORY_MAP_ET[category];

  try {
    const feed = await parser.parseURL(rssUrl);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedItems = feed.items.slice(startIndex, endIndex).map(item => {
      const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet || '',
        imageUrl: imageMatch ? imageMatch[1] : null,
      };
    });

    res.json(paginatedItems);
  } catch (err) {
    console.error('Error fetching ET Online RSS:', err.message);
    res.status(500).json({ error: 'Failed to fetch ET Online articles.' });
  }
});

const CATEGORY_MAP_STOCK = {
  'vn-stock': 'https://vietnamesestockmarket.com/feed',
  'global-stock': 'https://feeds.marketwatch.com/marketwatch/topstories/',
};

app.get('/stocknews', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || 'vn-stock';
  const rssUrl = CATEGORY_MAP_STOCK[category];

  try {
    const feed = await parser.parseURL(rssUrl);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedItems = feed.items.slice(startIndex, endIndex).map(item => {
      const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet || '',
        imageUrl: imageMatch ? imageMatch[1] : null,
      };
    });

    res.json(paginatedItems);
  } catch (err) {
    console.error('Error fetching stock news:', err.message);
    res.status(500).json({ error: 'Failed to fetch stock news.' });
  }
});

const CATEGORY_MAP_TECH = {
  // Canada
  'canada-mobilesyrup': 'https://mobilesyrup.com/feed/',
  'canada-betakit': 'https://betakit.com/feed/',
  'canada-itworld': 'https://www.itworldcanada.com/feed',

  // World
  'world-wired': 'https://www.wired.com/feed/rss',
  'world-techcrunch': 'https://techcrunch.com/feed/',
  'world-aiblog': 'https://www.artificial-intelligence.blog/rss-feeds',

  // Vietnam
  'vietnam-vna': 'https://vnanet.vn/en/rss/cat/technology-57.rss',
  'vietnam-ein': 'https://tech.einnews.com/rss/country/vietnam',
  'vietnam-vietnamplus': 'https://en.vietnamplus.vn/technology.rss',
};

app.get('/technews', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || 'canada-mobilesyrup';
  const rssUrl = CATEGORY_MAP_TECH[category];

  try {
    const feed = await parser.parseURL(rssUrl);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedItems = feed.items.slice(startIndex, endIndex).map(item => {
      const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet || '',
        imageUrl: imageMatch ? imageMatch[1] : null,
      };
    });

    res.json(paginatedItems);
  } catch (err) {
    console.error('Error fetching Tech news:', err.message);
    res.status(500).json({ error: 'Failed to fetch Tech news.' });
  }
});

const CATEGORY_MAP_ENV = {
  // Vietnam
  'vn-doi-song': 'https://vnexpress.net/rss/doi-song.rss',
  'vietnam-vnexpress-khoahoc': 'https://vnexpress.net/rss/khoa-hoc.rss',

  // Global
  'global-unep': 'https://www.unep.org/rss.xml',
  'global-globalissues': 'https://www.globalissues.org/whatsnew/whatsnew.xml',
  'global-grist': 'https://grist.org/feed/'
};


app.get('/envnews', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || 'vn-doi-song';
  const rssUrl = CATEGORY_MAP_ENV[category];
  const PAGE_SIZE = 10;

  try {
    const feed = await parser.parseURL(rssUrl);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedItems = feed.items.slice(startIndex, endIndex).map(item => {
      const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet || '',
        imageUrl: imageMatch ? imageMatch[1] : null,
      };
    });

    res.json(paginatedItems);
  } catch (err) {
    console.error('Error fetching Environmental news:', err.message);
    res.status(500).json({ error: 'Failed to fetch environmental news.' });
  }
});


app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
