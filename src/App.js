import React from 'react';
import { ChakraProvider, theme, CSSReset } from '@chakra-ui/react';
import Form from './component/form/form.component.jsx';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Form />
    </ChakraProvider>
  );
}

export default App;
