import { useContext } from 'react';

import {
  Box,
  Progress,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { FormContext } from '../../contexts/form.context';

export const Stats = () => {
  const { recordsCount, progressProcessingInPercent } = useContext(FormContext);

  return (
    <Box>
      <StatGroup>
        <Stat>
          <StatLabel>Slides</StatLabel>
          <StatNumber>{recordsCount}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Progress</StatLabel>
          <StatNumber>{progressProcessingInPercent}%</StatNumber>
        </Stat>
      </StatGroup>
      <Progress mt={1} value={progressProcessingInPercent} />
    </Box>
  );
};
