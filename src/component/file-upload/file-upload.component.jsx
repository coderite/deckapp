import React, { useState, useContext, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, VStack, Spinner } from '@chakra-ui/react';
import { parseCsvFile } from '../csv/csv.component';
import { FormContext } from '../../contexts/form.context';
import { FileUploadInput } from './file-upload-input/file-upload-input.component';

export const FileUpload = () => {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const { setFileName, setFormErrorLabel, setRecords } =
    useContext(FormContext);

  const onDrop = useCallback(async acceptedFiles => {
    const file = acceptedFiles[0];
    setIsFileUploading(true);

    try {
      if (file.type === 'text/csv') {
        const data = await parseCsvFile(file);
        //console.log('file upload data', JSON.stringify(data));

        setFileName(file.name);
        setRecords(data);
      } else {
        //console.error('Invalid file type. Please upload a CSV file.');
        setFormErrorLabel('Invalid file type. Please upload a CSV file.');
      }
    } catch (error) {
      setFormErrorLabel(error.message);
    }
    setIsFileUploading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box width="100%" mx="auto" mt="5">
      <VStack spacing={4}>
        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor="gray.400"
          borderRadius="md"
          p={4}
          textAlign="center"
          width="100%"
          height="200"
          cursor="pointer"
          _hover={{ borderColor: 'gray.500', color: 'gray:500' }}
        >
          {isFileUploading ? (
            <Spinner color="gray.400" />
          ) : (
            <FileUploadInput getInputProps={getInputProps} isDragActive />
          )}
        </Box>
      </VStack>
    </Box>
  );
};
