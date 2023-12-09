import React from "react";
import styles from "@/components/parts/sit_table/SitTable.module.css";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
// import {ReactComponent as DinnerTableSvg} from "@/images/icons/dinnerTable.svg"

const DinnerTableSvg = ({
  fill = "#ffffff",
  width = "800px",
  height = "800px",
}) => {
  return (
    <svg
      fill={fill}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 214.539 214.539"
      width={width}
      height={height}
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path
            d="M121.164,154.578h-6.625V89.14h38.937c4.014,0,7.269-3.254,7.269-7.269s-3.254-7.269-7.269-7.269h-92.41
                    c-4.014,0-7.269,3.254-7.269,7.269s3.254,7.269,7.269,7.269h38.936v65.438h-6.625c-4.014,0-7.269,3.254-7.269,7.27
                    c0,4.015,3.254,7.269,7.269,7.269h27.787c4.015,0,7.27-3.254,7.27-7.269C128.433,157.832,125.179,154.578,121.164,154.578z"
          />
          <path
            d="M73.783,120.777c0-4.014-3.254-7.269-7.269-7.269H54.833H34.219c-11.08,0-13.41-16.14-13.509-16.869l-6.239-45.122
                    c-0.55-3.977-4.217-6.748-8.196-6.205c-3.976,0.55-6.754,4.219-6.205,8.196l6.229,45.053c0.831,6.47,4.167,16.593,11.367,23.133
                    l-7.485,38.956c-0.758,3.942,1.824,7.752,5.766,8.509c3.946,0.761,7.752-1.825,8.509-5.766l6.792-35.349h17.579l6.792,35.349
                    c0.668,3.479,3.714,5.897,7.13,5.897c0.455,0,0.916-0.043,1.379-0.132c3.942-0.757,6.524-4.566,5.766-8.509l-6.265-32.605h2.883
                    C70.527,128.046,73.783,124.791,73.783,120.777z"
          />
          <path
            d="M208.267,45.313c-3.975-0.543-7.646,2.229-8.196,6.205l-6.244,45.165c-0.094,0.687-2.424,16.827-13.504,16.827h-20.614
                    h-11.681c-4.014,0-7.27,3.254-7.27,7.269s3.255,7.269,7.27,7.269h2.883l-6.265,32.605c-0.758,3.942,1.824,7.752,5.766,8.509
                    c3.946,0.761,7.752-1.825,8.509-5.766l6.792-35.349h17.579l6.792,35.349c0.668,3.479,3.714,5.897,7.13,5.897
                    c0.455,0,0.916-0.043,1.38-0.132c3.941-0.757,6.523-4.566,5.766-8.509l-7.485-38.953c7.198-6.534,10.532-16.64,11.357-23.065
                    l6.238-45.123C215.021,49.533,212.242,45.863,208.267,45.313z"
          />
        </g>
      </g>
    </svg>
  );
};

export const SitTable = ({
  tableNumber,
  reservations_table,
  onClick,
  selectedTable,
}) => {
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const table_id = `table_${tableNumber}`;
  // const open = Boolean(anchorEl);

  // const handleClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //     setAnchorEl(null);
  // };

  // const popover = <Popover
  //     id={table_id}
  //     open={open}
  //     anchorEl={anchorEl}
  //     onClose={handleClose}
  //     anchorOrigin={{
  //     vertical: 'bottom',
  //     horizontal: 'left',
  //     }}
  // >
  //     <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
  // </Popover>

  const table = (
    <div
      id={table_id}
      className={`${styles.container} ${tableNumber === selectedTable?.tableNumber ? styles.container_selected : ""}`}
      style={{
        borderColor: reservations_table.length > 0 ? "#ff0000" : "#ffffff",
      }}
    >
      {tableNumber !== 0 && (
        <div className={styles.wrapper} onClick={onClick}>
          <DinnerTableSvg width={tableNumber === selectedTable?.tableNumber ? 80 : 100} height={tableNumber === selectedTable?.tableNumber ? 80 : 100} />
          <div className={styles.reservations_count_wrapper}>
            <div className={styles.table_number}>No. {tableNumber}</div>
            <div className={styles.reservations_count}>
              {reservations_table.length}
            </div>
          </div>
        </div>
      )}
      {/* {popover} */}
    </div>
  );

  return tableNumber === selectedTable?.tableNumber ?
    <div className={styles.selected_table_container}>
      {table}
    </div>
  : table;
};
