import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Input({ label, variant, type, disabled, onChange, onSubmit, error, helperText }) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    >
      <TextField
        label={label}
        variant={variant}
        error={error}
        helperText={helperText}
        type={type}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}