import { useQuery } from "react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./UserPage.css"
import SideBar from "./SideBar";


function taskList() {
    return (
        <p>hello</p>
    )
}

function User() {
    return (
        <div>
            <SideBar />
            <h1>TO DO</h1>
            {taskList()}
        </div>
    )
}

export default User