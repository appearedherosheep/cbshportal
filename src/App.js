import * as React from "react";
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import MusicRequest from 'pages/MusicRequest'
import MusicList from 'pages/MusicList'

import 'App.css';

function App() {
  let navigate = useNavigate();

  return (
    <div>
      <Grid container item direction="column" justifyContent="center" alignItems="center">
        <h3>cbshportal.kro.kr</h3>
        <ButtonGroup variant="contained">
          <Button
            onClick={() => navigate('/musicRequest')}
          >기상송 신청</Button>
          <Button
            onClick={() => navigate('/musicList')}
          >신청 목록 보기</Button>
        </ButtonGroup>
        <>
          <Routes>
            <Route
              path='/musicRequest'
              element={<MusicRequest />}
            />
            <Route
              path='/musicList'
              element={<MusicList />}
            />
          </Routes>
        </>
        <span>수일 이내로 로그인 등 다양한 문제들을 개선할 예정입니다. 조금만 기다려 주세요!</span>
        <a target='_blank' href="https://forms.gle/8qYWnuQc3sGEkmrX8">문제 보고</a>
      </Grid>
      <ToastContainer />
    </div>
  );
}

export default App;
