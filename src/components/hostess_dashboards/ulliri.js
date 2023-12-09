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

export default function Component({ subdomain }) {
  const [newBookings, setNewBookings] = useState([]);
  const [startSelectedDate, setStartSelectedDate] = useState(dayjs());
  const [endSelectedDate, setEndSelectedDate] = useState(dayjs().add(1, "day"));
  const [reservationsOnDate, setReservationsOnDate] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

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

	async function getReservationsOnDateRange(startSelectedDate, endSelectedDate){
		const res = await fetch(`/api/booking/reservationsOnDate?startSelectedDate=${startSelectedDate.format('YYYY-MM-DDTHH:mm:ss')}&endSelectedDate=${endSelectedDate.format('YYYY-MM-DDTHH:mm:ss')}`)
		const bookings = (await(res.json())).bookings
		return bookings
	}

  useEffect(() => {
    getReservationsOnDateRange(startSelectedDate, endSelectedDate).then((bookings) => {
    	setReservationsOnDate(bookings)
    })
  }, [startSelectedDate, endSelectedDate]);

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.emit("joinRoom", subdomain);
    socket.on("new_booking_came", (bookings) => {
      setNewBookings([...bookings]);
    });
    socket.emit("new_booking", { subdomain_name: subdomain });
  }, []);

  //////////////// functions /////////////////////
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
    if (new_book)
      setNewBookings((prev) => [
        ...prev.filter((prev_booking) => prev_booking._id !== booking._id),
      ]);
    else {
      // setSelectedTable((prev) => ({...prev, reservations: prev.reservations.filter((prev_booking) => prev_booking._id !== booking._id)}))
      setReservationsOnDate((prev) => [
        { ...booking, reserved_table: reserved_table.toString() },
        ...prev.filter((prev_booking) => prev_booking._id !== booking._id),
      ]);
    }
  };

  const onBookRemove = ({ booking }) => {
    const book_id = booking._id;
    fetch("/api/booking/remove_book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id }),
    });
    // setSelectedTable((prev) => ({...prev, reservations: prev.reservations.filter((prev_booking) => prev_booking._id !== booking._id)}))
    setReservationsOnDate((prev) =>
      prev.filter((prev_booking) => prev_booking._id !== booking._id)
    );
  };

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
            <h2>Selected Table: {selectedTable?.tableNumber}</h2>
            {selectedTable?.reservations?.length === 0 ? (
              <h4 className={styles.right_notifs_title}>No bookings</h4>
            ) : (
              <h4>Bookings No.: {selectedTable?.tableNumber}</h4>
            )}
            {selectedTable.reservations.map((booking, index) => (
              <BookingNote
                key={index}
                booking={booking}
                tables={tables}
                onBookRemove={onBookRemove}
                onBookAccept={onBookAccept}
								getReservationsOnDateRange={getReservationsOnDateRange}
              />
            ))}
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
          key={index}
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
				label="Start Date and Time"
			/>
			<DateTimePicker
        onChange={(newValue) => setEndSelectedDate(newValue)}
        value={endSelectedDate}
				minDateTime={startSelectedDate}
				label="End Date and Time"
			/>
      <Button
        sx={{ height: "56px" }}
        variant="outlined"
        onClick={() => {
					setStartSelectedDate(dayjs())
					setEndSelectedDate(dayjs().add(1, "day"))
				}}
      >
        TODAY
      </Button>
			<Button
        sx={{ height: "56px" }}
        variant="outlined"
        onClick={() => {
					setStartSelectedDate(dayjs())
					setEndSelectedDate(dayjs().add(1, "week"))
				}}
      >
        Week
      </Button>
			<Button
        sx={{ height: "56px" }}
        variant="outlined"
        onClick={() => {
					setStartSelectedDate(dayjs())
					setEndSelectedDate(dayjs().add(1, "month"))
				}}
      >
        Week Month
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
                <div className={styles.tableColumn}>
                  {tables.map((tableNumber, index) => {
                    const reservations = reservationsOnDate.filter(
                      ({ reserved_table }) =>
                        parseInt(reserved_table) === tableNumber
                    );
                    return (
                      <SitTable
                        onClick={() =>
                          setSelectedTable({ reservations, tableNumber })
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
      </ThemeProvider>
    </>
  );
}
