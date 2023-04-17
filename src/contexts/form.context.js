import { useState, useEffect } from 'react';

import { createContext } from 'react';

export const FormContext = createContext({
  fileName: '',
  setFileName: () => {},
  recordsCount: 0,
  progressCount: 0,
  setProgressCount: () => {},
  progressProcessingInPercent: 0,
  setProgressProcessingInPercent: () => {},
  formErrorLabel: '',
  setFormErrorLabel: () => {},
  formSuccessLabel: '',
  setFormSuccessLabel: () => {},
  formLoading: false,
  setFormLoading: () => {},
  formDisabled: false,
  setFormDisabled: () => {},
  formSubmitted: false,
  setFormSubmitted: () => {},
  records: [],
  setRecords: () => {},
  addRecord: () => {},
});

export const FormProvider = ({ children }) => {
  const [formErrorLabel, setFormErrorLabel] = useState('');
  const [formSuccessLabel, setFormSuccessLabel] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [progressProcessingInPercent, setProgressProcessingInPercent] =
    useState(0);
  const [fileName, setFileName] = useState('');
  const [progressCount, setProgressCount] = useState(0);

  useEffect(() => {
    setRecordsCount(records.length);
  }, [records]);

  useEffect(() => {
    if (recordsCount === 0) {
      setProgressProcessingInPercent(() => 0);
    } else {
      setProgressProcessingInPercent(
        Math.round((progressCount / recordsCount) * 100)
      );
    }
  }, [progressCount, recordsCount]);

  const clearEverything = () => {
    console.log('clearEverything');
    setRecords([]);
    setFileName('');
    setProgressCount(() => 0);
  };

  const value = {
    isFileUploading: false,
    setIsFileUploading: () => {},
    recordsCount,
    setRecordsCount,
    progressCount,
    setProgressCount,
    progressProcessingInPercent,
    setProgressProcessingInPercent,
    formErrorLabel,
    setFormErrorLabel,
    formSuccessLabel,
    setFormSuccessLabel,
    formLoading,
    setFormLoading,
    formDisabled,
    setFormDisabled,
    formSubmitted,
    setFormSubmitted,
    records,
    setRecords,
    fileName,
    setFileName,
    clearEverything,
  };
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
