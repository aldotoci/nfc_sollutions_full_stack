import React, {useState} from 'react'

import styles from "./note_notification.module.css"
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

export default function Component({booking, onReject, onBookAccept, tables}) {
    const [open, setOpen] = useState(false);
    const [acceptModalVisible, setAcceptModalVisible] = useState(false);
    const [selectedTableNumber, setSelectedTableNumber] = useState();

    const birthday = dayjs(booking.birthday).format('DD/MM')
    const date = dayjs(booking.reserved_time).format('DD/MM')
    const time = dayjs(booking.reserved_time).format('HH:mm')

    const tables_flat = tables.flat().filter((table) => table !== 0)
    const list_obs = tables_flat.map((table) => ({label: table, year: table}))

    const reject_modal = <Modal
        open={open}
        onClose={() => setOpen(true)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style}>
          <Typography id="modal-modal-title" sx={{color: 'white'}} variant="h6" component="h2">
            Are you sure?
          </Typography>
          <div className={styles.buttons_container}>
            <Button variant="contained" color="success" onClick={() => onReject(booking)}>
              Reject
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
        {/* <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color: 'white', mb: 1}}>
          Select table:
        </Typography> */}

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={list_obs}
          sx={{ width: 200 }}
          onSelect={(event) => {
            setSelectedTableNumber(parseInt(event.target.value))
          }}
          renderInput={(params) => <TextField {...params} label="Table number" />}
        />

        <div className={styles.buttons_container}>
          <Button variant="outlined" color="error" onClick={() => setAcceptModalVisible(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={() => {
                onBookAccept({booking, reserved_table: selectedTableNumber})
                setAcceptModalVisible(false)
              }}>
            Accept
          </Button>
        </div>
      </Box>
    </Modal>

    return (
        <Card sx={{ width: 235 }} className={styles.card_container}>
          <CardContent >
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                New booking
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
                  Accept
                </Button>
            </CardActions>
            <CardActions>
                <Button size="small" variant="outlined" color="error" onClick={() => setOpen(true)}>
                  Reject
                </Button>
            </CardActions>
            
          </div>
          {reject_modal}
          {accept_modal}
        </Card>
    )
}
