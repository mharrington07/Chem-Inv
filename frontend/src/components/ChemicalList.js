import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the axios instance
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Container, Box, Link } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Import the shared CSS file

const ChemicalList = () => {
  const [chemicals, setChemicals] = useState([]);
  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [amount, setAmount] = useState('');
  const [msdsLookup, setMsdsLookup] = useState({});

  useEffect(() => {
    api.get('/chemicals')
      .then(response => {
        setChemicals(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));

    // Load the MSDS lookup table from the JSON file
    fetch('/msdsLookup.json') // Adjust the path to where the JSON file is located in the public folder
      .then(response => response.json())
      .then(data => setMsdsLookup(data))
      .catch(error => console.error('Error loading MSDS lookup table:', error));
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
        .catch(error => console.error('Error adding chemical:', error));
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
      .catch(error => console.error('Error deleting chemical:', error));
  };

  const handleProcessRowUpdate = async (newRow) => {
    const { id, ...updatedFields } = newRow;

    try {
      const response = await api.put(`/chemicals/${id}`, updatedFields);
      setChemicals(chemicals.map(chemical => chemical.id === id ? response.data : chemical));
      toast.success('Changes saved!');
      return response.data;
    } catch (error) {
      console.error('Error updating chemical:', error);
      toast.error('Failed to save changes!');
      throw error;
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddChemical();
    }
  };

  const generateFlinnUrl = (name) => {
    const lowerName = name.toLowerCase();
    return msdsLookup[lowerName] || null;
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, sortable: true },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      sortable: true,
      editable: true,
      renderCell: (params) => {
        const url = generateFlinnUrl(params.row.name);
        return url ? (
          <Link href={url} target="_blank" rel="noopener noreferrer">
            {params.row.name}
          </Link>
        ) : (
          <span>{params.row.name}</span>
        );
      },
    },
    { field: 'formula', headerName: 'Formula', flex: 1, sortable: true, editable: true },
    { field: 'amount', headerName: 'Amount', flex: 1, sortable: true, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          className="delete-button"
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: '25%' }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress} // Add keypress handler here
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Formula"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            onKeyPress={handleKeyPress} // Add keypress handler here
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress} // Add keypress handler here
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
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
        <Box sx={{ height: 400, width: '70%' }}>
          <DataGrid
            rows={chemicals}
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

export default ChemicalList;
