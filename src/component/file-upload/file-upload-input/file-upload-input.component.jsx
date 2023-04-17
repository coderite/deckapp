import { Input, Flex, Text } from '@chakra-ui/react';

export const FileUploadInput = ({ getInputProps, isDragActive }) => {
  return (
    <>
      <Input {...getInputProps()} />
      <Flex alignItems="center">
        {isDragActive ? (
          <Text>Drop the file here...</Text>
        ) : (
          <>
            <Text>Drag and drop a file here, or click to select a file</Text>
          </>
        )}
      </Flex>
    </>
  );
};
