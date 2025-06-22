import { useEffect, useState } from "react";
import axios from "axios";

function PendingTasks() {
  const [pendingCases, setPendingCases] = useState([]);
  //const API = import.meta.env.REACT_APP_API_URL // if using Vite

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const response = await axios.get("https://lawconnect-wxr0.onrender.com/pendingcases", { withCredentials: true });
        setPendingCases(response.data);
      } catch (error) {
        console.error("Error fetching pending cases:", error);
        setPendingCases([]);
      }
    };

    fetchPendingCases();
  }, []);

  return (
    <div className="tasks">
      <h2>Pending Cases</h2><br/>
      {Array.isArray(pendingCases) && pendingCases.length > 0 ? (
        <ul>
          {pendingCases.map((c, index) => (
            <li key={index}>
              <strong>{c.caseTitle}</strong> - {c.clientName} (Next Hearing: {c.nextHearing ? new Date(c.nextHearing).toLocaleDateString() : "Not Scheduled"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending cases found.</p>
      )}
    </div>
  );
  
}

export default PendingTasks;


