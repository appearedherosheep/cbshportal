import qs from 'qs'
import axios from 'axios'
import moment from 'moment'
import Button from '@mui/material/Button';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import * as React from 'react';

import Input from 'components/common/Input';
import BasicList from 'components/common/List';
import { toast } from 'react-toastify';
import { dbGet, dbUpdate } from 'utils/firebase'

export default function MusicList() {
    
    const [ dormitory, setDormitory ] = React.useState("saReum")
    
    const [ date, setDate ] = React.useState(moment(new Date()).add(1, 'days'));
    const [ musicList, setMusicList ] = React.useState([])
    
    const handleDormitoryChange = (e) => {
        setDormitory(e.target.value)
    }
    
    const getMusicData = () => {
        dbGet('temporaryMusics/' + dormitory + '/' + date.format("YYYYMMDD"))
        .then((snapshot) => {
            if(snapshot.exists()) {
                setMusicList(snapshot.val().map(x => x['title']))
            } else {
                setMusicList(["목록이 비어 있어요"])
            }
        })
        .catch((error) => {
            toast.error("예상하지 못한 에러가 발생했어요")
            console.error(error.code)
        })
    }
    
    if(musicList.length == 0) getMusicData()
    
    return(
        <div>
            <Grid container item direction="column" justifyContent="center" alignItems="center">
                <h1>신청 목록 보기</h1>
                <Grid container item direction="row" justifyContent="center" alignItems="center">
                    <FormControl>
                        <RadioGroup
                            row
                            defaultValue="saReum"
                            onChange={handleDormitoryChange}
                        >
                            <FormControlLabel value="saReum" control={<Radio />} label="사름학사" />
                            <FormControlLabel value="chungWoon" control={<Radio />} label="청운학사" />
                        </RadioGroup>
                    </FormControl>
                    <div style={{ width: 20 }}></div>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="조회할 날짜"
                            openTo="day"
                            value={date}
                            onChange={(newDate) => {
                                setDate(newDate);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <div style={{ width: 20 }}></div>
                    <Button
                        variant="contained"
                        onClick={getMusicData}
                        endIcon={<ManageSearchIcon />}
                    >조회</Button>
                </Grid>
                <BasicList items={musicList} />
            </Grid>
        </div>
    );
}