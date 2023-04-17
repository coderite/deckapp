import { useContext } from 'react';

import { Box, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { FormContext } from '../../contexts/form.context';

export const FilenameTag = () => {
  const { formLoading, fileName, clearEverything } = useContext(FormContext);

  const closeHandler = () => {
    console.log('closeHandler');
    clearEverything();
  };

  const disabledStyles = {
    cursor: formLoading ? 'not-allowed' : 'pointer',
    opacity: formLoading ? 0.4 : 1,
  };

  return (
    <Box>
      <Tag size="lg" borderRadius="full" variant="solid" colorScheme="teal">
        <TagLabel>{fileName}</TagLabel>
        <TagCloseButton
          onClick={formLoading ? undefined : closeHandler}
          style={disabledStyles}
        />
      </Tag>
    </Box>
  );
};
