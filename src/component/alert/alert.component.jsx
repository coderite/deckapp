import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  CloseButton,
} from '@chakra-ui/react';

import { useContext } from 'react';
import { FormContext } from '../../contexts/form.context.js';

const AlertMessage = ({ data }) => {
  const { setFormErrorLabel, setFormSucessLabel } = useContext(FormContext);

  const { status, message } = data;

  function closeHandler() {
    if (status === 'success') {
      setFormSucessLabel('');
    } else if (status === 'error') {
      setFormErrorLabel('');
    }
  }

  return (
    <Alert status={status}>
      <AlertIcon />
      <Box>
        <AlertDescription>{message}</AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={closeHandler}
      />
    </Alert>
  );
};

export default AlertMessage;
