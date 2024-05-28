import * as React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function BasicSelect() {
  const [age, setAge] = React.useState("");
  const [tempValue, setTempValue] = React.useState("");

  const handleAge = (evt) => {
    const selectedValue = evt.target.value;
    setTempValue(selectedValue); // Update the temporary state to reflect the selection

    if (selectedValue === "dddd") {
      const randomNumber = Math.floor(Math.random() * 100);
      setAge(randomNumber);
    } else {
      setAge("");
    }
    
    // Reset the selection momentarily to allow reselecting the same option
    setTimeout(() => setTempValue(""), 100);
  };

  console.log('age', age);

  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel>Select Age</InputLabel>
      <Select value={tempValue} onChange={handleAge} label="Select Age">
        <MenuItem value=""> Select </MenuItem>
        <MenuItem value="dddd"> Age </MenuItem>
      </Select>
    </FormControl>
  );
}
