import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButtons({ label, variant="contained", disabled, endIcon, onClick }) {
    return (
        <Button
        variant={variant}
        disabled={disabled}
        endIcon={endIcon}
        onClick={onClick}>
            {label}
        </Button>
    );
}