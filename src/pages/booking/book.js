import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useSession, signIn, signOut } from "next-auth/react"

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import styles from "@/styles/book.module.css";
import { TextField } from "@mui/material";

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import { onWebView } from "@/utils/views_funcs";
import { Button } from "@/components/parts/button";

import base_preview from "@/images/base_previews/ulliri.jpg";

export async function getServerSideProps(context) {
  const { req } = context;
  const subdomain = req.headers.host.split(".")[0];

  const schedules_for_choosen_day = [];

  onWebView(context).catch((err) => {});

  const apiUrl = `http://${req.headers.host}/api/exists_subdomains?subdomain=${subdomain}`;
  const res = await fetch(apiUrl);
  const { exists, links, storeName } = await res.json();
  return {
    props: {
      subdomain: exists ? subdomain : false,
      storeName,
    },
  };
}

export default function Home({ subdomain, storeName }) {
  const [currentFormState, setCurrentFormState] = useState(0);
  const [formData, setFormData] = useState({
    reserved_time: dayjs(`${dayjs().format("YYYY-MM-DD")}T17:30`).format("YYYY-MM-DDTHH:mm"),
    full_name: undefined,
    phone_number: '+355',
    email_address: undefined,
    guests: 2,
    birthday: undefined,
  });

  const { data: session } = useSession()
  
  console.log('session', session)

  if (subdomain === false) return <></>;

  function make_second_get_request() {
    // Get the full URL
    const fullUrl = window.location.href;
    console.log("making the request");
    fetch(fullUrl);
  }

  useEffect(() => {
    // Function to generate a UUID (you can use your preferred method)
    const generateUUID = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    };

    // Check if the uid_token exists in cookies
    const storedUidToken = Cookies.get("uid_token");
    if (storedUidToken) {
      // If it exists, set it in the state
    } else {
      // If it doesn't exist, generate a new one
      const newUidToken = generateUUID();
      // Save it to cookies
      Cookies.set("uid_token", newUidToken, { expires: 365 }); // Cookie expiration in days
    }

    // Check if reserved_time and guests are stored in localStorage
    const storedReservedTime = localStorage.getItem("reserved_time");
    const storedGuests = localStorage.getItem("guests");
    console.log('storedReservedTime', storedReservedTime)
    if (storedReservedTime && storedGuests) {
      // If it exists, set it in the state
      setFormData((formData) => ({ ...formData, reserved_time: storedReservedTime, guests: storedGuests }));
      setCurrentFormState(1);
      if(session) {
        setFormData((formData) => ({ ...formData, full_name: session.user.name, email_address: session.user.email }))
        setCurrentFormState(1);
      }
    }
  }, [session]); // Empty dependency array ensures this effect runs once on mount
  
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });


  function onDateChange(date) {
    const newDate = dayjs(date).format("YYYY-MM-DD");
    const prevHour = dayjs(formData.reserved_time).format("HH:mm");
    setFormData({
      ...formData,
      reserved_time: dayjs(`${newDate}T${prevHour}`).format("YYYY-MM-DDTHH:mm"),
    });
  }

  function onHourChange(date) {
    console.log('date', date)
    const prevDate = dayjs(formData.reserved_time).format("YYYY-MM-DD");
    const newHour = dayjs(date).format("HH:mm");
    setFormData({
      ...formData,
      reserved_time: dayjs(`${prevDate}T${newHour}`).format("YYYY-MM-DDTHH:mm"),
    });
  }

  function onDateLeft() {
    const newDate = dayjs(formData.reserved_time)
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    const prevHour = dayjs(formData.reserved_time).format("HH:mm");
    setFormData({
      ...formData,
      reserved_time: dayjs(`${newDate}T${prevHour}`).format("YYYY-MM-DDTHH:mm"),
    });
  }

  function onDateRight() {
    const newDate = dayjs(formData.reserved_time)
      .add(1, "day")
      .format("YYYY-MM-DD");
    const prevHour = dayjs(formData.reserved_time).format("HH:mm");
    setFormData({
      ...formData,
      reserved_time: dayjs(`${newDate}T${prevHour}`).format("YYYY-MM-DDTHH:mm"),
    });
  }

  function onHourLeft() {
    const prevDate = dayjs(formData.reserved_time).format("YYYY-MM-DD");
    const newHour = dayjs(formData.reserved_time)
      .subtract(15, "minute")
      .format("HH:mm");
    setFormData({
      ...formData,
      reserved_time: dayjs(`${prevDate}T${newHour}`).format("YYYY-MM-DDTHH:mm"),
    });
  }

  function onHourRight() {
    const prevDate = dayjs(formData.reserved_time).format("YYYY-MM-DD");
    const newHour = dayjs(formData.reserved_time)
      .add(15, "minute")
      .format("HH:mm");
    setFormData({
      ...formData,
      reserved_time: dayjs(`${prevDate}T${newHour}`).format("YYYY-MM-DDTHH:mm"),
    });
  }

  function onGuestsChange(e) {
    const v = e.target.value;
    setFormData({
      ...formData,
      guests: v < 0 ? 0 : v > 20 ? 20 : v,
    });
  }

  function onGuestsLeft() {
    const currentGuest = (formData?.guests || 0) - 1;
    setFormData({ ...formData, guests: currentGuest < 0 ? 0 : currentGuest });
  }

  function onGuestsRight() {
    const currentGuest = (formData?.guests || 0) + 1;
    setFormData({ ...formData, guests: currentGuest < 0 ? 0 : currentGuest });
  }

  function onBirthdayChange(date) {
    setFormData({
      ...formData,
      birthday: dayjs(date).format("YYYY-MM-DD"),
    });
  }

  const date_component = (
    <div className={styles.inputComponentWrapper}>
      <ArrowBackIosIcon onClick={onDateLeft} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          onChange={onDateChange}
          variant="filled"
          label="Date"
          format="DD/MM/YYYY"
          value={dayjs(formData?.reserved_time)}
          maxDate={dayjs().add(1, 'month')}
          minDate={dayjs()}
        />
      </LocalizationProvider>
      <ArrowForwardIosIcon onClick={onDateRight} />
    </div>
  );

  const hour_component = (
    <div className={styles.inputComponentWrapper}>
      <ArrowBackIosIcon onClick={onHourLeft} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Hour"
          views={["hours", "minutes"]}
          format="HH:mm"
          value={dayjs(formData?.reserved_time)}
          onChange={onHourChange}
          variant="filled"
        />
      </LocalizationProvider>
      <ArrowForwardIosIcon onClick={onHourRight} />
    </div>
  );

  const guests = (
    <div className={styles.inputComponentWrapper}>
      <ArrowBackIosIcon onClick={onGuestsLeft} />
      <TextField
        label="Guests"
        type="number"
        value={formData?.guests}
        variant="filled"
        min={0}
        onChange={onGuestsChange}
      />
      <ArrowForwardIosIcon onClick={onGuestsRight} />
    </div>
  );

	const onNext = (nextFormN) => {
		setCurrentFormState(nextFormN);
	}

	const onSubmit = () => {
    for (const [key, value] of Object.entries(formData)) {
      if(value === undefined || value === null || value === '') {
        //TO DO To be changed
        if(key === 'phone_number' || key ==='birthday') continue;
        //
        alert('Please fill all fields')
        return;
      }
    }
    localStorage.removeItem("reserved_time");
    localStorage.removeItem("guests");
		fetch(`/api/booking/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(() => setCurrentFormState(3))
	}

  const firstForm = (
    <>
      <div className="store-link">{date_component}</div>
      <div className="store-link">{hour_component}</div>
      <div className="store-link">{guests}</div>
      <Button onClick={() => {
        onNext(1)
        localStorage.setItem("reserved_time", formData?.reserved_time);
        localStorage.setItem("guests", formData?.guests);
      }}>Next</Button>
    </>
  );

  const google_login_button = <div className={styles.google_login_button_container}>
    <button onClick={() => signIn('google')} className={styles.google_button}>
      <img src={"/images/google_logo.jpeg"} alt="google_icon"/>Sign In with Google
    </button>
  </div>

  const login_step = <div className={styles.login_step_container}>
      <ArrowBackIosIcon onClick={() => onNext(0)} style={{fill: "#BB1616", fontSize: 30}} />
    <div className={styles.login_buttons_container}>
      {google_login_button}
      <Button onClick={() => onNext(2)}>Continue as a guest</Button>
      {session && session?.role === 'user' && <Button onClick={onSubmit}>Submit</Button>}
    </div>
    <div></div>
  </div>

  const secondForm = <>
		  <div className={`store-link ${styles.secondFormContainer}`}>
        <TextField
          label="Full Name"
          value={formData?.full_name}
          fullWidth
          onChange={(e) => setFormData((formData) => ({...formData, full_name: e.target.value}))}
        />
				<TextField
					label="Email"
          fullWidth
					type="email"
					value={formData?.email_address}
          onChange={(e) => setFormData((formData) => ({...formData, email_address: e.target.value}))}
				/>
        <PhoneInput
          defaultCountry="Al"
          value={formData?.phone_number}
          onChange={(phone_number) => setFormData((formData) => ({...formData, phone_number}))}
        />
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              onChange={onBirthdayChange}
              variant="filled"
              label="Birthday"
              format="DD/MM"
              value={formData?.birthday ? dayjs(formData?.birthday) : undefined}
            />
          </LocalizationProvider>
        </div>
			</div>
			<div className={styles?.midFormNavButtonsContainer}>
        <ArrowBackIosIcon onClick={() => onNext(1)} style={{fill: "#BB1616", fontSize: 30}} />
      	{/* <Button className={styles?.prevButton} onClick={() => onNext(0)}>Prev</Button> */}
        <Button onClick={onSubmit}>Submit</Button>
			</div>
	</>;

  const lastInfo = <>
    <div style={{
      color: 'white',
      textAlign: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '30px 10px',
    }} className={`store-link ${styles.secondFormContainer}`}>
      Your reservation is submitted!<br/>
      The confirmation will be sent to you via email&sms shortly. 
    </div>
  </>

  return (
    <ThemeProvider theme={theme}>
      <div className="store__container">
        <div className="store-layout">
          <div
            data-v-7578ada4=""
            id="fixed-background"
            className="d-none"
            bis_skin_checked="1"
          ></div>
          <div className="store-header">
            <div className="store-header__content">
              <div
                className={`store-header__image ${styles.storeHeader__image}`}
              >
                <img
                  src={base_preview?.src}
                  alt="user image"
                  className="base-preview-image"
                />
              </div>
              <div className="store-header__profile">
                <div className="store-header__name-bio">
                  <div className="store-header__names">
                    <div className="store-header__fullname">{storeName}</div>
                  </div>
                </div>
                {/* <div className="social-icons">
								<div
									href={tiktokLink}
									target="_blank"
									className="social-icons__icon"
									onClick={() => onClickLink(tiktokLink, 'tiktok')}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										alt="social icon"
									>
										<path d="M22.81,5.78v4.09c-2.12,0-4.09-.68-5.7-1.82v8.34c0,4.17-3.38,7.56-7.56,7.56-1.56,0-3-.47-4.21-1.28-2.02-1.36-3.35-3.66-3.35-6.28,0-4.17,3.38-7.56,7.56-7.56,.35,0,.69,.02,1.04,.07v4.18c-.33-.1-.68-.16-1.05-.16-1.91,0-3.46,1.55-3.46,3.46,0,1.35,.77,2.52,1.9,3.09,.47,.24,1,.37,1.56,.37,1.91,0,3.45-1.54,3.46-3.44V.06h4.11V.58c.02,.16,.04,.31,.06,.47,.29,1.63,1.26,3.02,2.61,3.86,.91,.57,1.96,.87,3.03,.86Z"></path>
									</svg>
								</div>
								<div
									href={instagramLink}
									target="_blank"
									className="social-icons__icon"
									onClick={() => onClickLink(instagramLink, 'instagram')}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										alt="social icon"
									>
										<path d="M12.06,.06c-3.24,0-3.65,.01-4.92,.07-1.27,.06-2.14,.26-2.9,.55-.79,.3-1.45,.71-2.11,1.38-.66,.66-1.07,1.33-1.38,2.11-.3,.76-.5,1.63-.55,2.9-.06,1.27-.07,1.68-.07,4.92s.01,3.65,.07,4.92c.06,1.27,.26,2.14,.55,2.9,.31,.79,.71,1.45,1.38,2.11,.66,.66,1.33,1.07,2.11,1.38,.76,.3,1.63,.5,2.9,.55,1.27,.06,1.68,.07,4.92,.07s3.65-.01,4.92-.07c1.27-.06,2.14-.26,2.9-.55,.78-.3,1.45-.71,2.11-1.38,.66-.66,1.07-1.33,1.38-2.11,.29-.76,.49-1.63,.55-2.9,.06-1.27,.07-1.68,.07-4.92s-.01-3.65-.07-4.92c-.06-1.27-.26-2.14-.55-2.9-.31-.79-.71-1.45-1.38-2.11-.66-.66-1.33-1.07-2.11-1.38-.76-.3-1.63-.5-2.9-.55-1.27-.06-1.68-.07-4.92-.07h0Zm-1.07,2.15c.32,0,.67,0,1.07,0,3.19,0,3.56,.01,4.82,.07,1.16,.05,1.8,.25,2.22,.41,.56,.22,.95,.47,1.37,.89,.42,.42,.68,.82,.89,1.37,.16,.42,.36,1.05,.41,2.22,.06,1.26,.07,1.64,.07,4.82s-.01,3.56-.07,4.82c-.05,1.16-.25,1.8-.41,2.22-.22,.56-.48,.95-.89,1.37-.42,.42-.81,.68-1.37,.89-.42,.16-1.05,.36-2.22,.41-1.26,.06-1.64,.07-4.82,.07s-3.56-.01-4.82-.07c-1.16-.05-1.8-.25-2.22-.41-.56-.22-.95-.47-1.37-.89-.42-.42-.68-.81-.89-1.37-.16-.42-.36-1.05-.41-2.22-.06-1.26-.07-1.64-.07-4.82s.01-3.56,.07-4.82c.05-1.16,.25-1.8,.41-2.22,.22-.56,.48-.95,.89-1.37,.42-.42,.82-.68,1.37-.89,.42-.16,1.05-.36,2.22-.41,1.1-.05,1.53-.06,3.75-.07h0Zm7.44,1.98c-.79,0-1.43,.64-1.43,1.43s.64,1.43,1.43,1.43,1.43-.64,1.43-1.43-.64-1.43-1.43-1.43h0Zm-6.37,1.67c-3.38,0-6.13,2.74-6.13,6.13s2.74,6.13,6.13,6.13c3.38,0,6.13-2.74,6.13-6.13s-2.74-6.13-6.13-6.13h0Zm0,2.15c2.2,0,3.98,1.78,3.98,3.98s-1.78,3.98-3.98,3.98-3.98-1.78-3.98-3.98,1.78-3.98,3.98-3.98Z"></path>
									</svg>
								</div>
							</div> */}
              </div>
            </div>
          </div>
          <div className={`store-content ${styles.personal_info_container}`}>
            {currentFormState === 0 && firstForm}
            {currentFormState === 1 && login_step}
            {currentFormState === 2 && secondForm}
            {currentFormState === 3 && lastInfo}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
