import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Container, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Import the shared CSS file

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/equipment')
      .then(response => {
        console.log('Fetched data:', response.data);  // Log fetched data to verify structure
        setEquipment(response.data);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleAddEquipment = () => {
    if (name && amount) {
      axios.post('http://localhost:5000/equipment', { name, amount })
        .then(response => {
          setEquipment([...equipment, response.data]);
          setName('');
          setAmount('');
          toast.success('Equipment has been added!');
        })
        .catch(error => console.error('Error adding equipment: ', error));
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDeleteEquipment = (id) => {
    axios.delete(`http://localhost:5000/equipment/${id}`)
      .then(() => {
        setEquipment(equipment.filter(item => item.id !== id));
        toast.success('Equipment has been deleted!');
      })
      .catch(error => console.error('Error deleting equipment: ', error));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddEquipment();
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, sortable: true },
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    { field: 'amount', headerName: 'Amount', flex: 1, sortable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          className="delete-button"  // Use the custom CSS class
          onClick={() => handleDeleteEquipment(params.row.id)}
        >
          X
        </Button>
      ),
      flex: 0.5,
    },
  ];

  return (
    <Container>
      <h1 className="my-4">Equipment</h1>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={equipment}
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
          onClick={handleAddEquipment}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Equipment
        </Button>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default EquipmentList;