import { useQuery } from "react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./UserPage.css"
import SideBar from "./SideBar";
import Header from "./Header";

const testData = [
  {
    "deckName": "Database",
    "New": 3,
    "Learn": 1,
    "OverDue": 2
  },
  {
    "deckName": "Hash Map",
    "New": 20,
    "Learn": 2,
    "OverDue": 0
  },
  {
    "deckName": "CSS",
    "New": 0,
    "Learn": 30,
    "OverDue": 2
  }
]

function TaskList() {
  return (
    <div className="tableContainer">
      <table className="taskTable">
        <thead>
          <tr>
            <th>deckName</th>
            <th>New</th>
            <th>Learn</th>
            <th>OverDue</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((data, index) => (
            <tr key={index}>
              <td>{data.deckName}</td>
              <td>{data.New}</td>
              <td>{data.Learn}</td>
              <td>{data.OverDue}</td>
              <td>
                <Link to="/review">
                  <button>Review</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function User() {
  return (
    <div>
      <Header />
      <SideBar />
      <h1 className="TODO">TO DO</h1>
      {TaskList()}
    </div>
  )
}

export default User