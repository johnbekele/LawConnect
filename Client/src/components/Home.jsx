import SideBar from "./sideBar"
import Calendar from "./Calender"
import PendingTasks from "./PendingTasks"
import Headlines from "./Headlines"
import "./sideBar.css"
import "./Home.css"

function Home() {
  return (
    <div>
      <SideBar />
      <div className="main-content">
        <div className="upper-content">
          <div className="calendar-container">
            <Calendar />
          </div>
          <div className="headlines-container">
            <Headlines />
          </div>
        </div>
        <div className="lower-content">
          <div className="pending-tasks-container">
            <PendingTasks />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home