import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the axios instance
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Container, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Import the shared CSS file

const ChemicalList = () => {
  const [chemicals, setChemicals] = useState([]);
  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    api.get('/chemicals')
      .then(response => {
        console.log('Fetched data:', response.data);  // Log fetched data to verify structure
        setChemicals(response.data);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleAddChemical = () => {
    if (name && formula && amount) {
      api.post('/chemicals', { name, formula, amount })
        .then(response => {
          setChemicals([...chemicals, response.data]);
          setName('');
          setFormula('');
          setAmount('');
          toast.success('Chemical has been added!');
        })
        .catch(error => console.error('Error adding chemical: ', error));
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDeleteChemical = (id) => {
    api.delete(`/chemicals/${id}`)
      .then(() => {
        setChemicals(chemicals.filter(chemical => chemical.id !== id));
        toast.success('Chemical has been deleted!');
      })
      .catch(error => console.error('Error deleting chemical: ', error));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddChemical();
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, sortable: true },
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    { field: 'formula', headerName: 'Formula', flex: 1, sortable: true },
    { field: 'amount', headerName: 'Amount', flex: 1, sortable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          className="delete-button"  // Use the custom CSS class
          onClick={() => handleDeleteChemical(params.row.id)}
        >
          X
        </Button>
      ),
      flex: 0.5,
    },
  ];

  return (
    <Container>
      <h1 className="my-4">Chemicals</h1>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={chemicals}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
          checkboxSelection
          disableSelectionOnClick
          autoHeight
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Formula"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddChemical}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Chemical
        </Button>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default ChemicalList;
