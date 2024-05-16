import React, { ReactElement } from 'react';
import { Box, Container, Paper, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Playground = (): ReactElement<React.FC> => {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1a1a1a', color: '#fff' }}>
        <Box sx={{ mb: 3 }}>
          <h1>Playground</h1>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <h2>Settings</h2>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#fff' }}>Model</InputLabel>
              <Select label="Model" sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}>
                <MenuItem value="model1">Model 1</MenuItem>
                <MenuItem value="model2">Model 2</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Temperature"
              type="number"
              fullWidth
              sx={{ mb: 2, color: '#fff', '.MuiOutlinedInput-root': { color: '#fff' }, '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}
              defaultValue={0.4}
              inputProps={{ step: 0.1, min: 0, max: 1 }}
            />
            <TextField
              label="Top P"
              type="number"
              fullWidth
              sx={{ mb: 2, color: '#fff', '.MuiOutlinedInput-root': { color: '#fff' }, '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}
              defaultValue={0.7}
              inputProps={{ step: 0.1, min: 0, max: 1 }}
            />
            <TextField
              label="Top K"
              type="number"
              fullWidth
              sx={{ mb: 2, color: '#fff', '.MuiOutlinedInput-root': { color: '#fff' }, '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}
              defaultValue={0}
              inputProps={{ step: 1, min: 0 }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <h2>Messages</h2>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#fff' }}>Role</InputLabel>
              <Select label="Role" sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Content"
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 2, color: '#fff', '.MuiOutlinedInput-root': { color: '#fff' }, '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" fullWidth sx={{ color: '#fff', backgroundColor: '#333' }}>
            Send Message
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Playground;