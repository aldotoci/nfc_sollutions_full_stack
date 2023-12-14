import React, {useState, useEffect} from 'react'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import dayjs from 'dayjs'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import styles from "./new_booking_note.module.css"

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

const modal_style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const accept_modal_style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function Component({save_booking, selectedTable, startSelectedDate}) {
    const [open, setOpen] = useState(false);
    const [acceptModalVisible, setAcceptModalVisible] = useState(false);
    const default_booking_data = {
      reserved_time: dayjs(startSelectedDate).add(2, 'hour'),
      reserved_table: selectedTable?.tableNumber,
      full_name: '',
      phone_number: '+355 ',
      email_address: undefined,
      guests: undefined,
      birthday: undefined,
      description: ''
    }
    const [booking_data, setBooking_data] = useState(default_booking_data)
    
    const reset_modal = <Modal
        open={open}
        onClose={() => setOpen(true)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style}>
          <Typography id="modal-modal-title" variant="h6" sx={{color: 'white'}} component="h2">
            Are you sure you want to reset?
          </Typography>
          <div className={styles.buttons_container}>
            <Button variant="contained" color="success" onClick={() => setBooking_data({...default_booking_data})}>
              Reset
            </Button>
            <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

    const save_modal = <Modal
      open={acceptModalVisible}
      onClose={() => setOpen(true)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={accept_modal_style}>
        <Typography id="modal-modal-title" variant="h6" sx={{color: 'white'}} component="h2">
          Save this Booking?
        </Typography> 
        <div className={styles.buttons_container}>
          <Button variant="contained" color="success" onClick={() => {
                save_booking(booking_data)
                setAcceptModalVisible(false)
                setBooking_data({...default_booking_data})
              }}>
            Save
          </Button>          
          <Button variant="outlined" color="error" onClick={() => setAcceptModalVisible(false)}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>

    return (
        <Card sx={{ width: 235 }} className={styles.card_container}>
          <CardContent >
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Add New booking
              </Typography>
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                <TextField 
                    placeholder='(First-Name) (Last-Name)' 
                    id="standard-basic" label="Clients name"
                    variant="standard"
                    value={booking_data.full_name}
                    onChange={(event) => setBooking_data({...booking_data, full_name: event.target.value})} 
                />
              </Typography>
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                <TextField 
                    placeholder='example@gmail.com' 
                    id="standard-basic" label="Email Address"
                    variant="standard"
                    value={booking_data.email_address}
                    onChange={(event) => setBooking_data({...booking_data, email_address: event.target.value})} 
                />
              </Typography>
              <Typography sx={{ mb: 2 }} color="text.secondary">
                <TextField 
                    placeholder='+355 68 #### ###' id="standard-basic" 
                    label="Phone Number" variant="standard" 
                    value={booking_data.phone_number}
                    onChange={(event) => setBooking_data({...booking_data, phone_number: event.target.value})}
                />
              </Typography>
              <Typography sx={{ mb: 3 }} color="text.secondary">
                <TextField 
                    placeholder='Ex. 2' id="standard-basic" 
                    type='number' label="Guests"
                    variant="standard"
                    value={booking_data.guests}
                    onChange={(event) => setBooking_data({...booking_data, guests: event.target.value})}
                />
              </Typography>
              <Typography variant="body2">
                <DateTimePicker 
                    label="Reservation Time" sx={{mb: 2}} 
                    value={booking_data.reserved_time}
                    format='DD/MM/YYYY HH:mm'
                    onChange={(value) => setBooking_data({...booking_data, reserved_time: value})}
                />
                <MobileDatePicker 
                    label="Clients birthday" sx={{mb: 2}} 
                    value={booking_data.birthday}
                    format='DD/MM'
                    onChange={(value) => setBooking_data({...booking_data, birthday: value})}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    placeholder='Anything special...'
                    value={booking_data.description}
                    onChange={(event) => setBooking_data({...booking_data, description: event.target.value})}
                />
              </Typography>
          </CardContent>
          <div className={styles.buttons_container}>
            <CardActions>
                <Button onClick={() => setAcceptModalVisible(true)} size="small" variant="outlined" color="success">
                  Save
                </Button>
            </CardActions>
            <CardActions>
                <Button size="small" variant="outlined" color="error" onClick={() => setOpen(true)}>
                    Reset
                </Button>
            </CardActions>
          </div>
          {reset_modal}
          {save_modal}
        </Card>
    )
}
