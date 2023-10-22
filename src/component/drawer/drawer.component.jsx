import { useState } from 'react';
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
const pino = require('pino');
const logger = pino({ prettyPrint: true });

export default function HelpDrawer() {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = newSize => {
    logger.info('hello world');
    setSize(newSize);
    onOpen();
  };

  return (
    <>
      <Button
        onClick={() => handleClick(size)}
        key="xl"
        m={4}
        leftIcon={<QuestionOutlineIcon />}
      >{`help`}</Button>

      <Drawer onClose={onClose} isOpen={isOpen} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{`How to use this app.`}</DrawerHeader>
          <DrawerBody>
            <p>
              Generate a PowerPoint deck from an internal platform CSV export.
            </p>
            <br />
            <p>
              The CSV needs to have the following columns with exact matching
              headers. If the text in the headers does not match one from the
              following list the deck generation will fail. The order of the
              columns does not matter.
            </p>
            <br />
            <p>
              Any missing screenshot URLs will automatically be replaced by an
              appropriate placeholder.
            </p>
            <br />
            <ul>
              <ul>
                <li>tester</li>
                <li>slot</li>
                <li>merchant</li>
                <li>location</li>
                <li>video</li>
                <li>screenshot1 (the payment lineup screenshot)</li>
                <li>screenshot2 (the widget screenshot)</li>
                <li>screenshot3 (the security slider screnshot)</li>
              </ul>
            </ul>
            <br />
            <img src="/exampleCsv.png" alt="screenshot" />
          </DrawerBody>
          <DrawerFooter>
            <p>
              Built by&nbsp;
              <a href="mailto:lsadilek@applausemail.com">Lucas Sadilek</a>
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
