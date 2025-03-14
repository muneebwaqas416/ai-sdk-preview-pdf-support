'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { FileContextState , FileItem , FileContextValue } from '../types/file-types';
import { v4 as uuidv4 } from 'uuid';

const FileContext = createContext<FileContextValue | undefined>(undefined);

type FileAction =
  | { type: 'SET_FILES'; payload: FileItem[] }
  | { type: 'ADD_FILES'; payload: FileItem[] }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_FILES' };

const initialState: FileContextState = {
  files: [],
  isUploading: false,
  error: null,
  progress: 0,
};

function fileReducer(state: FileContextState, action: FileAction): FileContextState {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...action.payload] };
    case 'REMOVE_FILE':
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.payload),
      };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_FILES':
      return initialState;
    default:
      return state;
  }
}

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(fileReducer, initialState);

  const validateFile = useCallback((file: File): boolean => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

    if (file.size > MAX_FILE_SIZE) {
      dispatch({ type: 'SET_ERROR', payload: 'File size exceeds 5MB limit' });
      return false;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid file type' });
      return false;
    }

    return true;
  }, []);

  const uploadFiles = useCallback(async (newFiles: File[]) => {
    try {
      dispatch({ type: 'SET_UPLOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_PROGRESS', payload: 0 });

      const validFiles = newFiles.filter(validateFile);

      if (validFiles.length === 0) {
        throw new Error('No valid files to upload');
      }

      const fileItems: FileItem[] = validFiles.map((file) => ({
        id: uuidv4(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }));

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        dispatch({ type: 'SET_PROGRESS', payload: i });
      }

      dispatch({ type: 'ADD_FILES', payload: fileItems });
      dispatch({ type: 'SET_PROGRESS', payload: 100 });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to upload files',
      });
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  }, [validateFile]);

  const removeFile = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FILE', payload: id });
  }, []);

  const clearFiles = useCallback(() => {
    dispatch({ type: 'CLEAR_FILES' });
  }, []);

  const value: FileContextValue = {
    ...state,
    uploadFiles,
    removeFile,
    clearFiles,
    validateFile,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFiles() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
}