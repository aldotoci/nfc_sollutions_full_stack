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

import styles from "./booking_note.module.css"

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

export default function Component({booking, onBookRemove, onBookAccept, tables, getReservationsOnDateRange}) {
    const [open, setOpen] = useState(false);
    const [acceptModalVisible, setAcceptModalVisible] = useState(false);
    const [selectedTableNumber, setSelectedTableNumber] = useState();

    const [tables_flat, setTables_flat] = useState(tables.flat().filter((table) => table !== 0))

    function update_tables()  {
      getReservationsOnDateRange(dayjs(booking?.reserved_time), dayjs().add(2, 'hours')).then((bookings) => {
        const tablesInBookings = bookings.map((booking) => booking.reserved_table)
        setTables_flat(tables.flat().filter((table) => table !== 0 && !tablesInBookings.includes(table.toString())))
      })
    }

    useEffect(() => {
      update_tables()
    }, [booking])

    const birthday = dayjs(booking.birthday).format('DD/MM')
    const date = dayjs(booking.reserved_time).format('DD/MM')
    const time = dayjs(booking.reserved_time).format('HH:mm')

    const reject_modal = <Modal
        open={open}
        onClose={() => setOpen(true)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style}>
          <Typography id="modal-modal-title" variant="h6" sx={{color: 'white'}} component="h2">
            Are you sure?
          </Typography>
          <div className={styles.buttons_container}>
            <Button variant="contained" color="success" onClick={() => onBookRemove({booking})}>
              Remove
            </Button>
            <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

    const accept_modal = <Modal
      open={acceptModalVisible}
      onClose={() => setOpen(true)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={accept_modal_style}>
        {/* <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color: 'white'}}>
          Select table:
        </Typography> */}

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={tables_flat}
          sx={{ width: 200 }}
          getOptionLabel={(option) => option.toString() || ""}
          onSelect={(event) => {
            setSelectedTableNumber(parseInt(event.target.value))
          }}
          renderInput={(params) => <TextField {...params} label="Update table" />}
        />

        <div className={styles.buttons_container}>
          <Button variant="outlined" color="error" onClick={() => setAcceptModalVisible(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => {
                onBookAccept({booking, reserved_table: selectedTableNumber, new_book: false})
                setAcceptModalVisible(false)
              }}>
            MOVE
          </Button>
        </div>
      </Box>
    </Modal>

    return (
        <Card sx={{ width: 235 }} className={styles.card_container}>
          <CardContent >
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Booking
              </Typography>
              <Typography variant="h5" component="div">
                {booking.full_name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {booking.phone_number}
              </Typography>
              <Typography variant="body2">
                {/* {booking?.description || 'No description'} */}
                Reserved time: {time} {bull} {date}
                <br />
                Clients birthday: {birthday}
              </Typography>
          </CardContent>
          <div className={styles.buttons_container}>
            <CardActions>
                <Button onClick={() => setAcceptModalVisible(true)} size="small" variant="outlined" color="success">
                  MOVE
                </Button>
            </CardActions>
            <CardActions>
                <Button size="small" variant="outlined" color="error" onClick={() => setOpen(true)}>
                  Remove
                </Button>
            </CardActions>
            
          </div>
          {reject_modal}
          {accept_modal}
        </Card>
    )
}
