import {sendEmail} from './emailUtils';
import dayjs from 'dayjs';


export const send_confirmation_email = async (booking_data) => {
  const {email_address, full_name, reserved_time, guests, subdomain_name} = booking_data;
  const date = dayjs(reserved_time).format('DD/MM');
  const time = dayjs(reserved_time).format('HH:mm');

  const subject = `Booking Confirmation for ${full_name}`;
  const text = `Dear ${full_name},\n\nThank you for booking at ${subdomain_name}. We are looking forward to seeing you on ${date} : ${time} with ${guests} guests. \n\nBest regards,\n${subdomain_name}`;
  await sendEmail({to: email_address, subject, text});
  console.log('Email sent to ', email_address)
}