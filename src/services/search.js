import axios from 'axios';

export const searchRepositories = async (
  topic,
  sortIt,
  language,
  page,
  order
) => {
  const result = await axios.get(
    `https://api.github.com/search/repositories?q=${topic}${
      language ? `+language:${language}` : ''
    }&page=${page}&per_page=10&order=${order}${sortIt ? '&sort=stars' : ''}`,
    {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }
  );
  return result.data;
};
