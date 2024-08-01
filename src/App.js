// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminWelcomePage from './AdminWelcomePage';
import OutOfDateReservations from "./OutOfDateReservations";
import DeskReservation from './DeskReservation';
import DeskList from "./DeskList";

function App() {
    return (
        <Router>
            <div>

                <Routes>
                    <Route path="/adminWebPage" element = {<AdminWelcomePage />} />
                    <Route path="/showReservations" element={<OutOfDateReservations />} />
                    {/*<Route path="/login" element={<Login />} />*/}
                    <Route path="/deskReservation" element={<DeskReservation />} />
                    <Route path="/deskList" element={<DeskList />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
