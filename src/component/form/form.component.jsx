import { useContext } from 'react';
import {
  Center,
  Box,
  Heading,
  Button,
  VStack,
  ScaleFade,
  Spinner,
} from '@chakra-ui/react';

import { FileUpload } from '../file-upload/file-upload.component';
import { Stats } from '../stats/stats.component';
import { FormContext } from '../../contexts/form.context.js';
import { FilenameTag } from '../filename-tag/filename.tag.component.jsx';
import {
  createPresentation,
  createSlideAsync,
  writePresentiationToFile,
  addSlidesToPresentation,
} from '../../pptx.js';
import HelpDrawer from '../drawer/drawer.component';
import AlertMessage from '../alert/alert.component';

const Form = () => {
  const {
    setProgressCount,
    records,
    fileName,
    formErrorLabel,
    formSuccessLabel,
    setFormErrorLabel,
    setFormSuccessLabel,
    recordsCount,
    setFormLoading,
    formLoading,
  } = useContext(FormContext);

  // starts the process of
  const createHandler = async () => {
    setProgressCount(() => 0);
    setFormLoading(() => true);
    let errorSeen = false;
    //console.log('records', records);

    const pptx = createPresentation();

    // a try catch block is needed to catch nested errors in async functions and display it on the UI
    /*   try {
      for (const entry of records) {
        console.log('creating slide entry: ', entry);
        await createSlide(pptx, entry);
        setProgressCount(prevProgressCount => prevProgressCount + 1);
        console.log('slide created...');
      }
    } catch (error) {
      console.log('something went wrong creating slides: ', error.message);
      console.log('caught this error: ', error);
      setFormErrorLabel(error.message);
      errorSeen = true;
    } */

    /* collect all the slides in basic object that we can pass to the addSildesToPresentation method */
    const slides = await Promise.all(
      records.map(async record => {
        const slide = await createSlideAsync(record);
        setProgressCount(prevProgressCount => prevProgressCount + 1);
        return slide;
      })
    );

    addSlidesToPresentation(pptx, slides);

    writePresentiationToFile(pptx, 'test.pptx');
    console.log('deck creation completed');
    console.log('wait for download...');
    setFormLoading(() => false);

    if (!errorSeen) {
      setFormErrorLabel('');
      setFormSuccessLabel('Success!');
    }
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

            {/** # slides and % progress stats  */}
            <Stats />

            {/** create button */}
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

            {/** alert message for both error and success status */}
            {formErrorLabel && (
              <AlertMessage
                data={{ status: 'error', message: formErrorLabel }}
              />
            )}
            {formSuccessLabel && !formErrorLabel && (
              <AlertMessage
                data={{ status: 'success', message: formSuccessLabel }}
              />
            )}

            {/** help drawer with instructions on how to use the app */}
            <HelpDrawer />
          </VStack>
        </Box>
      </Center>
    </ScaleFade>
  );
};

export default Form;
