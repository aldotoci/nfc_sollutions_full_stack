import domain_to_component from "@/config/domain_to_component";
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { onWebView } from "@/utils/views_funcs";

export async function getServerSideProps(context) {
  const { req } = context;
  const subdomain = req.headers.host.split('.')[0];

  onWebView(context).catch((err) => {})

  const apiUrl = `http://${req.headers.host}/api/exists_subdomains?subdomain=${subdomain}`
  const res = await fetch(apiUrl)
  const {exists, links, storeName} = await res.json()
  if(!exists) return {props: {subdomain: false}}
  return {
    props: {
      subdomain: exists ? subdomain : false,
      links,
      storeName
    }
  }
}


export default function Home({subdomain, links=false, storeName=false}) {
  if(subdomain === false) return <></>

  function make_second_get_request() {
    // Get the full URL
    const fullUrl = window.location.href;
    console.log('making the request');
    fetch(fullUrl)
  }

  useEffect(() => {
    // Function to generate a UUID (you can use your preferred method)
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Check if the uid_token exists in cookies
    const storedUidToken = Cookies.get('uid_token');
    if (storedUidToken) {
      // If it exists, set it in the state
    } else {
      // If it doesn't exist, generate a new one
      const newUidToken = generateUUID();
      // Save it to cookies
      Cookies.set('uid_token', newUidToken, { expires: 365 }); // Cookie expiration in days
      make_second_get_request()
    }
  }, []); // Empty dependency array ensures this effect runs once on mount

  return subdomain ? domain_to_component[subdomain]({links, storeName}) : <></>
}