import { ThemeOptions } from '@mui/material';

export const DEFAULT_HIST_HEIGHT = 200;
export const DEFAULT_PADDING = 3;
export const DEFAULT_PAGE_LIMITS = [5, 10, 25];
export const DEFAULT_SPACING = 3;

export enum FFColors {
  Orange = '#ff8a00',
  Pink = '#cc01ab',
  Purple = '#6b00f2',
  Red = '#e1111e',
  Yellow = '#ffca00',
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#12171d',
      paper: '#1e242a',
    },
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#9BA7B0',
    },
    info: {
      main: FFColors.Pink,
    },
    success: {
      main: FFColors.Purple,
    },
    warning: {
      main: FFColors.Yellow,
    },
    error: {
      main: FFColors.Red,
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9BA7B0',
      disabled: '#51565a',
    },
  },
};

export const FFBackgroundHover = '#252C32';
