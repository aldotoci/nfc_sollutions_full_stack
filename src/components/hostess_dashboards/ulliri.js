import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import io from "socket.io-client";
import Note_notification from "@/components/parts/note_notification/note_notification";
import { SitTable } from "@/components/parts/sit_table/SitTable";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "@/styles/hostess_dashboard.module.css";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BookingNote from "@/components/parts/booking_note/booking_note";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import New_booking_note from "@/components/parts/new_booking_note/new_booking_note";
import React, { useRef } from 'react';
import dotenv from 'dotenv';
import Alert from '@mui/material/Alert';
dotenv.config({ path: '../.env.local' });

export default function Component({ subdomain }) {
  // **** STATES **** //
  const [newBookings, setNewBookings] = useState([]);
  const [startSelectedDate, setStartSelectedDate] = useState(dayjs().add(-2, 'hours'));
  const [endSelectedDate, setEndSelectedDate] = useState(dayjs().endOf('day'));
  const [reservationsOnDate, setReservationsOnDate] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false)

  // **** REFS **** //
  const audioRef = useRef(null);

  // **** CONFIGS **** //
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const tables = [
    [1, 2, 3, 4],
    [0, 5, 0, 6],
    [7, 8, 9, 0],
    [10, 0, 0, 0],
  ];

  //////////////// functions /////////////////////
	const getReservationsOnDateRange = async (startSelectedDate, endSelectedDate) => {
		const res = await fetch(`/api/booking/reservationsOnDate?startSelectedDate=${startSelectedDate.format('YYYY-MM-DDTHH:mm:ss')}&endSelectedDate=${endSelectedDate.format('YYYY-MM-DDTHH:mm:ss')}`)
		const bookings = (await(res.json())).bookings
		return bookings
	}

  const playBellSound = () => {
    const audio = audioRef.current;
    try{
      if (audio && audio.paused) {
        audio.play();
      }
    }catch(err){
      console.log('Error: ', err)
    }
  };

  const save_booking = (booking_data) => {
    fetch("/api/booking/book_from_hostess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...booking_data, 
        birthday: booking_data.birthday?.format('YYYY-MM-DDTHH:mm:ss'), 
        reserved_time: booking_data.reserved_time?.format('YYYY-MM-DDTHH:mm:ss')}),
    }).then((res) => {
      return res.json()
    }).then(({booking}) => {
      setReservationsOnDate(bookings => [...bookings, booking])
    })
    setAlertVisible(`Booking was saved to table ${booking_data?.reserved_table} successfully!`)
    setTimeout(() => setAlertVisible(false), 3000)
  }

  const onNewNotReject = (booking) => {
    const book_id = booking._id;
    fetch("/api/booking/reject_book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id }),
    });
    setNewBookings((prev) => [
      ...prev.filter((prev_booking) => prev_booking._id !== booking._id),
    ]);
    setAlertVisible(`Booking from ${booking?.full_name} was rejected!`)
    setTimeout(() => setAlertVisible(false), 3000)
  };

  const onBookAccept = ({ booking, reserved_table, new_book = true }) => {
    const book_id = booking._id;
    fetch("/api/booking/accept_book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id, reserved_table }),
    });
    if (new_book){
      setNewBookings((prev) => [...prev.filter((prev_booking) => prev_booking._id !== booking._id)]);
      setAlertVisible(`Booking saved to table ${reserved_table} successfully!`)
      setTimeout(() => setAlertVisible(false), 3000)
    }
    else{
      setAlertVisible(`Booking moved to table ${reserved_table} successfully!`)
      setTimeout(() => setAlertVisible(false), 3000)
    }

    setReservationsOnDate((prev) => [
      { ...booking, reserved_table: reserved_table.toString() },
      ...prev.filter((prev_booking) => prev_booking._id !== booking._id),
    ]);

  };

  const onBookRemove = ({ booking }) => {
    fetch("/api/booking/remove_book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id: booking._id }),
    });
    // setSelectedTable((prev) => ({...prev, reservations: prev.reservations.filter((prev_booking) => prev_booking._id !== booking._id)}))
    setReservationsOnDate((prev) =>
      prev.filter((prev_booking) => prev_booking._id !== booking._id)
    );
    setAlertVisible('Booking removed successfully!')
    setTimeout(() => setAlertVisible(false), 3000)
  };

  // **** COMPONENTS **** //

  const navigator_header = (
    <div className={styles.navigator_container}>
      <h1 className={styles.restaurant_title}>Ulliri</h1>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
        }}
        size="small"
        variant="outlined"
        color="error"
        onClick={() => signOut()}
      >
        Sign out
      </Button>
    </div>
  );

  const left_nav = (
    <div className={styles.left_nav_container}>
      <div className={styles.left_nav_wrapper}>
        {selectedTable && (
          <div className={styles.left_nav_item_content}>
            <h2 style={{textAlign: 'center'}}>Selected Table: {selectedTable?.tableNumber}</h2>
            <h4 className={styles.right_notifs_title}>
              {selectedTable?.reservations?.length === 0 ? 
                'No bookings' : <>Bookings No.: {selectedTable?.tableNumber}</>
              }
            </h4>
            {selectedTable.reservations.map((booking, index) => (
              <BookingNote
                key={booking._id}
                booking={booking}
                tables={tables}
                onBookRemove={onBookRemove}
                onBookAccept={onBookAccept}
								getReservationsOnDateRange={getReservationsOnDateRange}
              />
            ))}
            <New_booking_note
              tables={tables}
              selectedTable={selectedTable}
              onBookAccept={onBookAccept}
              getReservationsOnDateRange={getReservationsOnDateRange}
              save_booking={save_booking}
              startSelectedDate={startSelectedDate}
            />
          </div>
        )}
      </div>
    </div>
  );

  const right_notifications = (
    <div className={styles.right_notifications_container}>
      <h2 className={styles.right_notifs_title}>New Bookings</h2>
      {newBookings.map((booking, index) => (
        <Note_notification
          key={booking._id}
          booking={booking}
          tables={tables}
          onReject={onNewNotReject}
          onBookAccept={onBookAccept}
					getReservationsOnDateRange={getReservationsOnDateRange}
        />
      ))}
    </div>
  );

  const body_header = (
    <div className={styles.body_header_container}>
			<DateTimePicker
        onChange={(newValue) => setStartSelectedDate(newValue)}
        value={startSelectedDate}
				maxDateTime={endSelectedDate}
        format="DD/MM/YYYY HH:mm"
				label="Start Date and Time"
        slotProps={{ textField: { size: 'small' } }}
			/>
			<DateTimePicker
        onChange={(newValue) => setEndSelectedDate(newValue)}
        value={endSelectedDate}
				minDateTime={startSelectedDate}
        format="DD/MM/YYYY HH:mm"
				label="End Date and Time"
        slotProps={{ textField: { size: 'small' } }}
			/>
      <Button
        sx={{ height: "40px" }}
        variant="outlined"
        onClick={() => {
					setStartSelectedDate(dayjs().add(-2, 'day'))
					setEndSelectedDate(dayjs().endOf('day'))
				}}
      >
        TODAY
      </Button>
			<Button
        sx={{ height: "40px" }}
        variant="outlined"
        onClick={() => {
					setStartSelectedDate(dayjs().startOf('day'))
					setEndSelectedDate(dayjs().endOf('week'))
				}}
      >
        This Week
      </Button>
			<Button
        sx={{ height: "39px" }}
        variant="outlined"
        onClick={() => {
					setStartSelectedDate(dayjs())
					setEndSelectedDate(dayjs().endOf("month"))
				}}
      >
        This Month
      </Button>
    </div>
  );

  const restaurant_map = (
    <div className={styles.restaurant_map_container}>
      <TransformWrapper>
        <TransformComponent>
          <div className={styles.restaurant_map_wrapper}>
            {/* Your content goes here */}
            <div className={styles.tablesContainer}>
              {tables.map((tables, index) => (
                <div key={index} className={styles.tableColumn}>
                  {tables.map((tableNumber, index) => {
                    const reservations = reservationsOnDate.filter(
                      ({ reserved_table }) =>
                        parseInt(reserved_table) === tableNumber
                    );
                    return (
                      <SitTable
                        onClick={() =>
                          setSelectedTable((d) => d?.tableNumber !== tableNumber ? ({ reservations, tableNumber }) : undefined)
                        }
                        reservations_table={reservations}
                        key={index}
                        tableNumber={tableNumber}
												selectedTable={selectedTable}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );

  const table_and_notifications = (
    <div className={styles.table_and_notifications_container}>
      {restaurant_map}
      {right_notifications}
    </div>
  );

  const main_body = (
    <div className={styles.main_body_container}>
      {body_header}
      {table_and_notifications}
    </div>
  );

  const body = (
    <div className={styles.body_container}>
      {left_nav}
      {main_body}
    </div>
  );

  // **** USE EFFECTS **** //

  useEffect(() => {
    if (selectedTable) {
      setSelectedTable((prev) => ({
        ...prev,
        reservations: reservationsOnDate.filter(
          ({ reserved_table }) => parseInt(reserved_table) === prev.tableNumber
        ),
      }));
    }
  }, [reservationsOnDate]);

  useEffect(() => {
    getReservationsOnDateRange(startSelectedDate, endSelectedDate).then((bookings) => {
    	setReservationsOnDate(bookings)
    })
  }, [startSelectedDate, endSelectedDate]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_Web_Socket_Server);
    socket.on('connect', () => {
      console.log('Connected with session ID:', socket.id);
      socket.emit("joinRoom", subdomain);
      socket.emit("new_booking", { subdomain_name: subdomain });
      socket.on("new_booking_came", (bookings) => {
        setNewBookings([...bookings]);
        playBellSound()
      });
    });
  }, []);

  return (
    <>
      <Head>
        <style>
          {`
						body{
							background-color: #101418;
						}
					`}
        </style>
      </Head>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className={styles.dashboard_container}>
            {navigator_header}
            {body}
          </div>
        </LocalizationProvider>
        <div style={{display: !!alertVisible ? 'block'  : 'none'}} className={styles.alert_container}>
          <Alert severity="success">
            {alertVisible}
          </Alert>             
        </div>
      </ThemeProvider>
      <audio ref={audioRef} src='/audio/mixkit-achievement-bell-600.wav' />
    </>
  );
}
