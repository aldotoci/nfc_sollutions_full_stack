import { signOut } from "next-auth/react"
import styles from "@/styles/hostess_dashboard.module.css"

export default function Component() {
    
  
	
	const navigator_header = <div className={styles.navigator_container}>
		<h1>Ulliri</h1>
		<button onClick={() => signOut()}>Sign out</button>
	</div>

	const left_nav = <div className={styles.left_nav_container}>
		left Navigations
	</div>

	const body_header = <div className={styles.body_header_container}>
		This date and hour will be selected by the hostess
	</div>

	const restaurant_map = <div className={styles.restaurant_map_container}>
		<h1>Here will be the map</h1>
	</div>

	const right_notifications = <div className={styles.right_notifications_container}>
		<div className={styles.right_notifications_header}>
			<h2>Notifications</h2>
		</div>
		<div className={styles.right_notifications_body}>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 1</h3>
				<p>Customer has arrived</p>
			</div>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 2</h3>
				<p>Customer has arrived</p>
			</div>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 3</h3>
				<p>Customer has arrived</p>
			</div>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 4</h3>
				<p>Customer has arrived</p>
			</div>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 5</h3>
				<p>Customer has arrived</p>
			</div>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 6</h3>
				<p>Customer has arrived</p>
			</div>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 7</h3>
				<p>Customer has arrived</p>
			</div>
			<div className={styles.right_notifications_body_item}>
				<h3>Table 8</h3>
				<p>Customer has arrived</p>
			</div>
		</div>
	</div>

	const table_and_notifications = <div className={styles.table_and_notifications_container}>
		{restaurant_map}
		{right_notifications}
	</div>

	const main_body = <div className={styles.main_body_container}>
		{body_header}
		{table_and_notifications}
	</div>

	const body = <div className={styles.body_container}>
		{left_nav}
		{main_body}
	</div>

	return (
		<div className={styles.dashboard_container}>
			{navigator_header}
			{body}
		</div>
	)
}