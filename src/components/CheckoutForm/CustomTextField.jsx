import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';


const FormInput = ({ name, label, required }) => {
    // Properties
    const { control } = useFormContext();

    return (
        <Grid item xs={12} sm={6}>
            <Controller 
                as={TextField} 
                control={control}
                defaultValue={''}
                name={name}
                fullWidth
                render={({ field: { onChange, value } }) => (
                    <TextField 
                        label={label}
                        required={required}
                        onChange={onChange}
                        value={value}
                        variant='standard' 
                    />
                )}
            />
        </Grid>
    );
}

export default FormInput;