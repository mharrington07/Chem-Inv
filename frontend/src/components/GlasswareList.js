import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the axios instance
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Container, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Import the shared CSS file

const GlasswareList = () => {
  const [glassware, setGlassware] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    api.get('/glassware')
      .then(response => {
        setGlassware(response.data);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleAddGlassware = () => {
    if (name && amount) {
      api.post('/glassware', { name, amount })
        .then(response => {
          setGlassware([...glassware, response.data]);
          setName('');
          setAmount('');
          toast.success('Glassware has been added!');
        })
        .catch(error => console.error('Error adding glassware: ', error));
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDeleteGlassware = (id) => {
    api.delete(`/glassware/${id}`)
      .then(() => {
        setGlassware(glassware.filter(item => item.id !== id));
        toast.success('Glassware has been deleted!');
      })
      .catch(error => console.error('Error deleting glassware: ', error));
  };

  const handleProcessRowUpdate = async (newRow) => {
    const { id, ...updatedFields } = newRow;

    try {
      const response = await api.put(`/glassware/${id}`, updatedFields);
      setGlassware(glassware.map(item => item.id === id ? response.data : item));
      toast.success('Changes saved!');
      return response.data;
    } catch (error) {
      console.error('Error updating glassware:', error);
      toast.error('Failed to save changes!');
      throw error;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddGlassware();
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, sortable: true },
    { field: 'name', headerName: 'Name', flex: 1, sortable: true, editable: true },
    { field: 'amount', headerName: 'Amount', flex: 1, sortable: true, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          className="delete-button"
          onClick={() => handleDeleteGlassware(params.row.id)}
        >
          X
        </Button>
      ),
      flex: 0.5,
    },
  ];

  return (
    <Container>
      <h1 className="my-4">Glassware</h1>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: '25%' }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGlassware}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Glassware
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '70%' }}>
          <DataGrid
            rows={glassware}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 30]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            processRowUpdate={handleProcessRowUpdate}
          />
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default GlasswareList;
