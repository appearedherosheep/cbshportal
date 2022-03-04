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
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import * as React from 'react';

import Input from 'components/common/Input';
import BasicList from 'components/common/List';
import { toast } from 'react-toastify';
import { db, dbGet, dbUpdate } from 'utils/firebase'

let searchResult, title, artist, musicList

export default function MusicRequest() {

    const [ isSearchDisabled, setSearchDisabled ] = React.useState(false)
    const [ isApplyDisabled, setApplyDisabled ] = React.useState(true)

    const [ dormitory, setDormitory ] = React.useState("사름")
    const [ searchQuery, setSearchQuery ] = React.useState("")

    const [ date, setDate ] = React.useState(moment(new Date()));
    const [ musicList, setMusicList ] = React.useState([])
    const [ selectedMusic, setSelectedMusic ] = React.useState("")

    const handleDormitoryChange = (e) => {
        setDormitory(e.target.value)
    }

    const handleSearch = () => {
        setSearchDisabled(true)

        if( searchQuery.length != 0 ){
            searchLastFM(searchQuery)
            .then(data => {
                setMusicList(showMusicData(data))
                setSearchDisabled(false)
            })
        } else {
            toast.error("검색할 내용을 입력해주세요")
            setSearchDisabled(false)
        }
    }

    const handleTargetMusicTitle = ( title ) => {
        setSelectedMusic(title)
        setApplyDisabled(false)
    }

    const handleApply = () => {
        setApplyDisabled(true)
        checkAndApply( (dormitory == "사름" ? "saReum" : "chungWoon"), date.format("YYYYMMDD"), selectedMusic)
    }

    function checkAndApply( dormitory, date, title ) {
        dbGet('temporaryMusics/' + dormitory + '/' + date)
        .then((snapshot) => {
            if(snapshot.exists()) {
                var candidateArray = snapshot.val().map(x => x['title'])
                if(candidateArray.includes(title)) {
                    toast.error("이미 신청된 노래에요")
                    setApplyDisabled(false)
                } else {
                    if(snapshot.val().length == 9) {
                        if(snapshot.val()[8] === false) {
                            toast.error("해당 날짜의 신청이 마감되었어요")
                            setApplyDisabled(false)
                        }
                    } else {
                        const updates = {};
                        updates['temporaryMusics/' + dormitory + '/' + date + '/' + snapshot.val().length] = { title: title }
                        dbUpdate(updates)
                        .then(() => {
                            toast.success("신청에 성공했어요")
                            setSelectedMusic("")
                        })
                        .catch((error) => {
                            toast.error("예상하지 못한 에러가 발생했어요")
                            setApplyDisabled(false)
                            console.error(error.code)
                        })
                    }
                }
            } else {
                const updates = {};
                updates['temporaryMusics/' + dormitory + '/' + date + '/0'] = { title: title }
                dbUpdate(updates)
                .then(() => {
                    toast.success("신청에 성공했어요")
                    setSelectedMusic("")
                })
                .catch((error) => {
                    toast.error("예상하지 못한 에러가 발생했어요")
                    setApplyDisabled(false)
                    console.error(error.code)
                })
            }
        })
        .catch((error) => {
            toast.error("예상하지 못한 에러가 발생했어요")
            setApplyDisabled(false)
            console.error(error.code)
        })
    }

    function handleSubmit(event) {
        event.preventDefault();
        handleSearch()
    }

    return(
        <div>
            <Grid container item direction="column" justifyContent="center" alignItems="center">
                <h1>기상송 신청</h1>
                <Grid container item direction="row" justifyContent="center" alignItems="center">
                    <FormControl>
                        <RadioGroup
                            row
                            defaultValue="사름"
                            onChange={handleDormitoryChange}
                        >
                            <FormControlLabel value="사름" control={<Radio />} label="사름학사" />
                            <FormControlLabel value="청운" control={<Radio />} label="청운학사" />
                        </RadioGroup>
                    </FormControl>
                    <div style={{ width: 20 }}></div>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="신청할 날짜"
                            openTo="day"
                            value={date}
                            onChange={(newDate) => {
                                setDate(newDate);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <div style={{ height: 20 }} />
                <Grid container item direction="row" justifyContent="center" alignItems="center">
                    <Input
                    label="제목 or 가수"
                    disabled={isSearchDisabled}
                    onChange={setSearchQuery}
                    onSubmit={handleSubmit}
                    />
                    <Button
                        variant="contained"
                        disabled={isSearchDisabled}
                        endIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >검색</Button>
                </Grid>
                <BasicList items={musicList} handleListItemClick={handleTargetMusicTitle}/>
                <Grid container item direction="row" justifyContent="center" alignItems="center">
                    <h3>선택됨:</h3>
                    <span style={{width: 5}}></span>
                    <h3>{selectedMusic !== "" ? selectedMusic : "선택된 노래 없음"}</h3>
                    <span style={{width: 10}}></span>
                    <Button
                        variant="contained"
                        endIcon={<ArrowUpwardIcon />}
                        disabled={isApplyDisabled}
                        onClick={handleApply}
                    >신청</Button>
                </Grid>
                <span><b>아직 취소 기능이 구현되지 않았습니다! 신중하게 신청해주세요!</b></span>
            </Grid>
        </div>
    );
}

function showMusicData( data ) {
    searchResult = data['results']['trackmatches']['track']
    title = searchResult.map(x => x['name'])
    artist = searchResult.map(x => x['artist'])   

    musicList = title.map( function(x, i) {
        return x.concat(' - ', artist[i])
    })

    return musicList
}

function searchLastFM( query ) {
    const promise = axios.post('https://ws.audioscrobbler.com/2.0', qs.stringify({
        "method": "track.search",
        "limit": 5,
        "track": query,
        "api_key": "a5e3ccdd0f753262a11189919706befe",
        "format": "json"
    }))

    return promise.then((response) => response.data)
}