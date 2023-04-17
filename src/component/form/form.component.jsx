import { useContext } from 'react';
import {
  Center,
  Box,
  Heading,
  Button,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  ScaleFade,
  CloseButton,
  Spinner,
} from '@chakra-ui/react';

import { FileUpload } from '../file-upload/file-upload.component';
import { Stats } from '../stats/stats.component';
import { FormContext } from '../../contexts/form.context.js';
import { FilenameTag } from '../filename-tag/filename.tag.component.jsx';
import {
  createPresentation,
  createSlide,
  writePresentiationToFile,
} from '../../pptx.js';

const Form = () => {
  const {
    setProgressCount,
    records,
    fileName,
    formErrorLabel,
    setFormErrorLabel,
    recordsCount,
    setFormLoading,
    formLoading,
  } = useContext(FormContext);

  function AlertErrorHandler() {
    setFormErrorLabel(false);
  }

  const createHandler = async () => {
    setProgressCount(() => 0);
    setFormLoading(() => true);
    console.log('createHandler');
    console.log('records', records);

    const pptx = createPresentation();
    if (pptx) console.log('pptx created');

    for (const entry of records) {
      console.log('creating slide entry', entry);
      await createSlide(pptx, entry);
      setProgressCount(prevProgressCount => prevProgressCount + 1);
      console.log('createHandler end of loop');
    }

    /* const createSlidesPromises = records.map(async entry => {
      console.log('creating slide entry', entry);
      try {
        await createSlide(pptx, entry);
      } catch (error) {
        console.log('error', error);
      }
      setProgressCount(prevProgressCount => prevProgressCount + 1);
      console.log('createHandler end of loop');
    });

    await Promise.all(createSlidesPromises); */

    writePresentiationToFile(pptx, 'test.pptx');
    setFormLoading(() => false);
  };

  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Center h="100vh" bg="gray.100">
        <Box p="5" maxW="400px" borderWidth="1px" borderRadius="md">
          <VStack alignItems="left" spacing="10px">
            <Heading my="2" size="md">
              Trustly Audit 3.0 Deck Generator
            </Heading>

            {fileName && fileName.length > 0 ? <FilenameTag /> : <FileUpload />}
            <Stats />
            {recordsCount > 0 && (
              <Button
                colorScheme="teal"
                mt={2}
                size="lg"
                onClick={createHandler}
                isDisabled={formLoading ? true : false}
              >
                {formLoading ? <Spinner /> : <span>create</span>}
              </Button>
            )}

            {formErrorLabel && (
              <Alert status="error">
                <AlertIcon />
                <Box>
                  <AlertDescription>{formErrorLabel}</AlertDescription>
                </Box>
                <CloseButton
                  alignSelf="flex-start"
                  position="relative"
                  right={-1}
                  top={-1}
                  onClick={AlertErrorHandler}
                />
              </Alert>
            )}
          </VStack>
        </Box>
      </Center>
    </ScaleFade>
  );
};

export default Form;
