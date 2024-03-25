import { useQuery } from "react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "./SideBar";


function cardCreate() {

    return (
        <div className="card-create-page">
            <SideBar/>
        </div>
    );
}

export default cardCreate;