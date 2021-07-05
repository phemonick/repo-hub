import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, Button, Badge, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function DetailsPage({ history }) {
  const [repo, setRepo] = useState({});

  useEffect(() => {
    const state = history.location?.state;
    if (!state) return history.push('/');
    setRepo(state);
  }, [history]);

  return (
    <Box>
      <Button onClick={() => history.goBack()}>Go back</Button>
      {repo.name && (
        <Box>
          <Heading>{repo.name}</Heading>
          <Box d="flex" alignItems="baseline" mt="10px">
            <Badge borderRadius="full" px="2" colorScheme="teal">
              {repo.language}
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              &bull; {repo.forks.toLocaleString()} forks &bull;{' '}
              {repo.stargazers_count?.toLocaleString() || 0} stars
            </Box>
          </Box>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            mt="15px"
          >
            By {repo.owner?.login}
          </Box>
          <Text mt="15px" mb="20px">
            {repo.description}
          </Text>
          <Link href={repo.html_url} isExternal>
            Open on github <ExternalLinkIcon mx="2px" />
          </Link>
        </Box>
      )}
    </Box>
  );
}
