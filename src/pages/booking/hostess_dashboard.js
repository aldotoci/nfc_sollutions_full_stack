import { useSession, signIn, signOut } from "next-auth/react"
import domain_to_hostess from "@/config/domain_to_hostess"

export async function getServerSideProps(context) {
  const { req } = context;
  const subdomain = req.headers.host.split('.')[0];

  const apiUrl = `http://${req.headers.host}/api/exists_subdomains?subdomain=${subdomain}`
  const res = await fetch(apiUrl)
  const {exists, links, storeName} = await res.json()
  return {
    props: {
      subdomain: exists ? subdomain : false,
    }
  }
}

export default function Component({subdomain}) {
  const { data: session } = useSession()
  if (!session) {
    return (
      <>
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }
  return subdomain ? domain_to_hostess[subdomain]() : <></>
}