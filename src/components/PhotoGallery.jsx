import React, { useState } from 'react';
import { Button, Input, Typography, Box, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const PhotoGallery = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        // Handle uploading logic here, e.g., send the file to the server
        console.log('Uploading file:', selectedFile);
    };

    return (
        <Box
            p={3}
            border={1}
            borderRadius={4}
            boxShadow={2}
            maxWidth={400}
            mx="auto"
            mt={4}
        >
            <Typography variant="h5" align="center" gutterBottom>Photo Gallery</Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} align="center">
                    <label htmlFor="upload-photo">
                        <Button
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            color="primary"
                            component="span"
                        >
                            Choose Photo
                        </Button>
                    </label>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="upload-photo"
                    />
                </Grid>
                {selectedFile && (
                    <Grid item xs={12} align="center">
                        <Typography variant="body1" gutterBottom>
                            Selected File: {selectedFile.name}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpload}
                        >
                            Upload
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default PhotoGallery;
