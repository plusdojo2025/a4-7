import './App.css';
import {BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import './schedule/SchedulePage.css';

import LoginPage from './login/LoginPage';
import SignupPage from './signup/SignupPage';
import SchedulePage from './schedule/SchedulePage';
import EventPage from './event/EventPage';
import SugorokuPage from './sugoroku/SugorokuPage';
import ScheduleMakePage from './scheduleMake/ScheduleMakePage';
import BookRecommend from './scheduleMake/BookRecommend';
import Test from './test/Test';
import Header from './components/Header'
import Menu from './components/MenuHeader';
import TaskHeader from './components/TaskHeader';
import TriviaHeader from './components/TriviaHeader';
import LogoHeader from './components/LogoHeader';

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState([]);
  const [vacationId, setVacationId] = useState();
  const [today, setToday] = useState('2025-07-22');
  const [todayTasks, setTodayTasks] = useState([]);
  const userId = localStorage.getItem('userId') || "";

  //  初期設定 ----------------------------------------
  useEffect(() => {
    
    // 背景画像の取得
      axios.get('/users/' + userId)
      .then(userRes => {
        const backgroundId = userRes.data.backgroundId;
        return axios.get('/backgrounds/' + backgroundId, {responseType: 'blob'});
      })
      .then(bgRes => {
        const blob = bgRes.data;
        const imageUrl = URL.createObjectURL(blob);
        setBackgroundUrl(imageUrl)
      })
      .catch(error => {
        console.error('背景画像の取得に失敗しました:', error);
      })    
  }, []);

  //  main ----------------------------------------
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <div className='backgroundImage' style={
                backgroundUrl
                ? { backgroundImage: `url(${backgroundUrl})` }
                : { backgroundColor: "#282c34" } 
            }>
          <HeaderConditional today={today} setToday={setToday} todayTasks={todayTasks}/>
          
          
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/schedule' element={<SchedulePage key={today} today={today} vacationId={vacationId} setVacationId={setVacationId} setTodayTasks={setTodayTasks}/>} /> {/* ket={変数}で、変数が変更したら再マウント */}
            <Route path='/event' element={<EventPage />} />
            <Route path='/sugoroku' element={<SugorokuPage changeBackground={setBackgroundUrl} vacationId={vacationId} setVacationId={setVacationId} />} />
            <Route path='/scheduleMake' element={<ScheduleMakePage />} />
            <Route path='/bookRecommend' element={<BookRecommend />} />
            <Route path='/test' element={<Test />} />
          </Routes>
          </div>
        </Router>
      </header>
    </div>
  );
}

// Headerの表示を条件分岐するコンポーネントを作る----------------------
function HeaderConditional({today, setToday, todayTasks}) {
  const location = useLocation();
  const hideHeaderPaths = ['/signup', '/'];

  // 今のパスがhideHeaderPathsに含まれていなければHeaderを表示
  if (hideHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return(
    <div>
      <ul id='header'>
          <li><TriviaHeader  today={today} setToday={setToday}/></li>
          <li><LogoHeader/></li>
          <li>
              <TaskHeader  taskList={todayTasks}              
              />
          </li>
      </ul>
      <Menu></Menu>
    </div>
  )
}

export default App;
