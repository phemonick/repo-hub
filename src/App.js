import React from 'react';
import { ChakraProvider, Box, Grid, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import DetailsPage from './pages/Details';
function App() {
  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Box fontSize="md">
          <Grid p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/details" component={DetailsPage} />
              <Route path="*">
                <Box>Lost</Box>
              </Route>
            </Switch>
          </Grid>
        </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;
