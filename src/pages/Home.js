import React, { useCallback, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
  InputRightElement,
  Button,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Spacer,
  Flex,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import {
  StarIcon,
  SearchIcon,
  RepeatClockIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@chakra-ui/icons';
import { searchRepositories } from '../services/search';
import { Card } from '../components/Card';
import { useHistory } from 'react-router';
import ReactPaginate from 'react-paginate';
import OutsideClickHandler from 'react-outside-click-handler';
import './Home.css';

export default function HomePage() {
  const history = useHistory();
  const [searchTopic, setSearchTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortByStars, setSortByStars] = useState(false);
  const [result, setResult] = useState([]);
  const [hasResult, setHasResult] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [order, setOrder] = useState('desc');

  const onPageSelect = e => {
    setPageNumber(e.selected + 1);
    searchRepo(language, e.selected + 1, sortByStars, order);
  };

  const handleOrderChange = () => {
    const newOrder = order === 'desc' ? 'asc' : 'desc';
    setOrder(newOrder);
    searchRepo(language, pageNumber, sortByStars, newOrder);
  };

  const searchRepo = useCallback(
    async (language, pageNumber, sortByStars, order) => {
      setLoading(true);
      try {
        const { items, total_count } = await searchRepositories(
          searchTopic,
          sortByStars,
          language,
          pageNumber,
          order
        );
        if (items.length === 0) {
          setHasError(true);
          setPageCount(total_count);
        } else {
          const searchHistoryList = [...searchHistory];
          if (searchHistory.length >= 10) {
            searchHistoryList.pop();
          }
          searchHistoryList.unshift(searchTopic);
          setSearchHistory([...new Set(searchHistoryList)]);
          setPageCount(total_count);
        }
        setResult(items);
        setLoading(false);
        setHasResult(true);
        setErrorMessage('');
      } catch (error) {
        const {
          data: { message },
        } = error.response;
        setErrorMessage(message);
        setResult([]);
        setLanguage('');
        setSortByStars(false);
        setLoading(false);
        setHasResult(true);
        setHasError(true);
        setPageCount(0);
        setPageNumber(1);
      }
    },
    [searchTopic, sortByStars, pageNumber, order]
  );

  const handleLanguageChange = e => {
    let lang = e.target.value || '';
    setLanguage(lang);
    searchRepo(lang, pageNumber, sortByStars, order);
  };

  const handleSortChange = () => {
    const sort = sortByStars;
    setSortByStars(prev => !prev);
    searchRepo(language, pageNumber, !sort, order);
  };

  const handleSearch = () => {
    searchRepo(language, pageNumber, sortByStars, order);
  };

  const handleRemoveHistory = i => {
    setSearchHistory(searchHistory.filter((history, index) => index !== i));
  };

  const historyList =
    searchHistory.length > 0 &&
    searchHistory.map((history, index) => (
      <ListItem
        key={index}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          listStyleType: 'none',
          cursor: 'pointer',
          marginTop: '5px',
        }}
        _hover={{
          backgroundColor: '#eee',
        }}
        onClick={() => setSearchTopic(history)}
      >
        <span>
          <RepeatClockIcon style={{ marginRight: '10px' }} />
          {history}
        </span>
        <span
          onClick={() => handleRemoveHistory(index)}
          style={{
            textDecoration: 'underline',
            color: 'grey',
          }}
        >
          Remove
        </span>
      </ListItem>
    ));

  return (
    <Box
      fontSize="md"
      mt={!hasResult && '15%'}
      mr="auto"
      ml="auto"
      width="500px"
    >
      <Heading textAlign="center" mb="12px" fontSize="4rem">
        RepoHub
      </Heading>
      <VStack spacing={8} position="relative">
        <Box w="100%">
          <OutsideClickHandler onOutsideClick={() => setShowHistory(false)}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                type="text"
                placeholder="Search Repo"
                value={searchTopic}
                onChange={e => setSearchTopic(e.target.value)}
                onFocus={e => setShowHistory(true)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  isLoading={loading}
                  h="1.75rem"
                  size="sm"
                  onClick={handleSearch}
                  disabled={!searchTopic}
                >
                  Go
                </Button>
              </InputRightElement>
            </InputGroup>
            {showHistory && searchHistory.length > 0 && (
              <Box
                w="100%"
                maxH="300px"
                style={{
                  border: '1px solid #eee',
                  borderTop: 0,
                  position: 'absolute',
                  backgroundColor: '#fff',
                  zIndex: '999',
                  boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
                  overflowY: 'scroll',
                }}
              >
                <UnorderedList ml="0">{historyList}</UnorderedList>
              </Box>
            )}
          </OutsideClickHandler>
        </Box>

        {result.length ? (
          <Flex w="100%" flexDir="column" alignItems="flex-end">
            <Text color="#50749c">Filter</Text>
            <Box>
              <FormControl
                display="flex"
                alignItems="center"
                mb="10px"
                isDisabled={loading}
              >
                <FormLabel htmlFor="sort-stars" mb="0" fontSize={['sm', 'md']}>
                  Sort by stars
                </FormLabel>
                <Switch
                  id="sort-stars"
                  isChecked={sortByStars}
                  onChange={handleSortChange}
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl
                display="flex"
                alignItems="center"
                mb="10px"
                cursor="pointer"
                isDisabled={loading}
                onClick={handleOrderChange}
              >
                <FormLabel cursor="pointer" mb="0" fontSize={['sm', 'md']}>
                  Sort by order: {order === 'desc' ? 'ASC' : 'DESC'}
                </FormLabel>
                {order === 'desc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </FormControl>
            </Box>
            <Spacer />
            <Select
              placeholder="All language"
              mb="10px"
              isDisabled={loading}
              onChange={handleLanguageChange}
              value={language}
              width="auto"
            >
              <option value="r">R</option>
              <option value="c">C</option>
              <option value="python">Python</option>
              <option value="javascript">Javascript</option>
            </Select>
          </Flex>
        ) : hasError ? (
          <Box spacing={3} w="100%">
            {errorMessage ? (
              <Text textColor="red">{errorMessage}</Text>
            ) : (
              <>
                <Text>
                  Your search - <b>{searchTopic}</b> - did not match any
                  documents.
                </Text>
                <Text mt="10px" mb="10px">
                  Suggestions:
                </Text>
                <UnorderedList>
                  <ListItem>
                    Make sure that all words are spelled correctly
                  </ListItem>
                  <ListItem>Try different keywords.</ListItem>
                  <ListItem>Try more general keywords.</ListItem>
                </UnorderedList>
              </>
            )}
          </Box>
        ) : null}
        {result.map(repo => (
          <Card
            maxW="3xl"
            mx="3vw"
            w="90vw"
            p="10px"
            key={repo.id}
            onClick={() => history.push('/details', repo)}
          >
            <Box d="flex" alignItems="baseline">
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
                &bull; {repo.forks.toLocaleString()} forks
              </Box>
            </Box>

            <Box
              mt="1"
              fontWeight="semibold"
              as="h5"
              lineHeight="tight"
              isTruncated
              maxW="80%"
            >
              {repo.name}
            </Box>

            <Text
              mt="1"
              fontSize="sm"
              lineHeight="tight"
              color="gray.500"
              noOfLines={3}
            >
              {repo.description}
            </Text>
            <Box as="span" color="gray.600" fontSize="sm">
              {repo.owner?.login}
            </Box>

            <Box d="flex" mt="2" alignItems="center">
              <StarIcon
                color={repo.stargazers_count ? 'teal.500' : 'gray.300'}
              />

              <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {repo.stargazers_count.toLocaleString()} stars
              </Box>
            </Box>
          </Card>
        ))}
        {pageCount > 10 && (
          <ReactPaginate
            previousLabel={'←'}
            nextLabel={'→'}
            pageCount={pageCount}
            onPageChange={onPageSelect}
            containerClassName={'pagination'}
            previousLinkClassName={'pagination__link'}
            nextLinkClassName={'pagination__link'}
            disabledClassName={'pagination__link--disabled'}
            activeClassName={'pagination__link--active'}
          />
        )}
      </VStack>
    </Box>
  );
}
