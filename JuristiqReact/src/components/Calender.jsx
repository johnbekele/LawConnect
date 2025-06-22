import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./calender.css"; 
function Calender() {
const [hearingDate, setHearingDates] = useState([]);
//const API = import.meta.env.REACT_APP_API_URL // if using Vite

  useEffect(() => {
    const fetchHearingDates = async () => {
      try {
        const response = await axios.get("https://lawconnect-wxr0.onrender.com/hearings", { withCredentials: true });

        console.log("Fetched hearing dates:", response.data); // Debugging log

        // const formattedDates = response.data.map(date => {
        //   const localDate = new Date(date);
        //   localDate.setHours(localDate.getHours() - localDate.getTimezoneOffset() / 60);
        //   return localDate.toISOString().split("T")[0];
        // });

        //this works but test more
        const formattedDates = response.data.map(date => {
          const localDate = new Date(date);
          localDate.setDate(localDate.getDate() - 1); // Subtract 1 day
          return localDate.toISOString().split("T")[0];
        });      

        console.log("Formatted hearing dates:", formattedDates); // Debugging log

        setHearingDates(formattedDates);
      } catch (error) {
        console.error("Error fetching hearing dates:", error);
      }
    };

    fetchHearingDates();
  }, []);

  return (
    <div className="calender">
      <Calendar
        tileClassName={({ date }) => {
          const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

          return hearingDate.includes(formattedDate) ? "highlight" : null;
        }}
      />
    </div>
  );
}

export default Calender;
