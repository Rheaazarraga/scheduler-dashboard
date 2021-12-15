import React, { Component } from "react";

import classnames from "classnames";

import Loading from "./Loading";
import Panel from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  
  state = {
    loading: false,
    focused: null
  };


  // lifecycle method to check to see if there is saved focus state after the application is rendered for the first time
  // when the local storage contains state, the state can be set to match the application
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
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
        value={panel.value}
        onSelect={e => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
