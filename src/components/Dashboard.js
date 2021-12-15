import React, { Component } from "react";

import classnames from "classnames";

import Loading from "./Loading";
import Panel from "./Panel";

import axios from "axios";

import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };


  // lifecycle method to check to see if there is saved focus state after the application is rendered for the first time
  // when the local storage contains state, the state can be set to match the application
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }

  // lifecycle method to listen for changes to the state, and has access to the props and state from the previous update
  componentDidUpdate(previousProps, previousState) {
    // if values of the existing state change, write value to localStorage
    if(previousState.focused !== this.state.focused) {
      // JSON.stringify converts values before writing them to the localStorage
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  // set the value of focused back to null if the value of focused is currently set to a panel
  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }


  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = data
      .filter(
        panel => this.state.focused === null || this.state.focused === panel.id
      )
            
      .map(panel => (
      <Panel
        key={panel.id}
        label={panel.label}
        value={panel.getValue(this.state)}
        onSelect={() => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
