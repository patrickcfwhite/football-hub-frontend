import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormControl, FormLabel, FormControlLabel, Checkbox, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import auth from '../lib/auth'
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%',
    margin: '15px 0'
  },
  genderContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '15px 0'
  }
}))

const CourseBookingDialogue = ({
  open,
  handleClose,
  Transition,
  courses,
  selectedBooking,
  companyId,
  companyName }) => {

  const { course, session } = selectedBooking
  const { day, startTime, endTime } = courses[course].courseDetails.sessions[session]
  const { age, cost, paymentInterval } = courses[course].courseDetails

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    number: '',
    dob: new Date(),
    gender: '',
    enquiryType: 'booking',
    message: 'Hi, I would like to make a booking for the above course listed',
    company: companyName,
    subject: `${age} ${day} ${startTime} - ${endTime}`,
    userId: auth.getUserId(),
    companyId,
  })

  const [genders, setGender] = useState({
    male: false,
    female: false,
    custom: false
  })


  const handleBookingFormChange = (e) => {
    const { name, value } = e.target
    setBookingForm({ ...bookingForm, [name]: value })
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    axios.post('/enquiries', bookingForm)
      .then(res => {
        console.log(res.data.message)
        handleClose()
        // setIsLoading(false)
      })
      .catch(err => {
        // setIsLoading(false)
        console.log(err.response.data)
      })
  }

  const handleGenderChange = e => {
    const { name, checked } = e.target
    const checkedObj = {}
    Object.keys(genders).map(el => checkedObj[el] = false)
    setGender({ ...checkedObj, [name]: checked })
    setBookingForm({ ...bookingForm, gender: name })
  }


  const classes = useStyles()


  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle style={{ margin: '30px 0' }} id="alert-dialog-slide-title">
        <Box
          fontSize={25} fontWeight="fontWeightBold" m={0}>
          {companyName}
        </Box>
        Age Group: {age} <br />
        Session Details: {day} {startTime} - {endTime} <br />
        Price: £{cost} per {paymentInterval} <br />
      </DialogTitle>

 

      <DialogContent>
      <Box
          fontSize={20} fontWeight="fontWeightBold" m={0}>
          Player Details
        </Box>
        
        <form
          noValidate autoComplete="off"
        >

          <TextField className={classes.input}
            onChange={e => handleBookingFormChange(e)}
            id="outlined-basic" label="Player Name" name='name' variant="outlined" />
          <TextField className={classes.input}
            onChange={e => handleBookingFormChange(e)}
            id="outlined-basic" label="Email Address" name='email' variant="outlined" />
          <TextField className={classes.input}
            onChange={e => handleBookingFormChange(e)}
            id="outlined-basic" label="Phone Number" name='number' variant="outlined" />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.input}
              margin="normal"
              id="date-picker-dialog"
              label="Date of Birth"
              format="MM/dd/yyyy"
              value={bookingForm.dob}
              onChange={date => setBookingForm({ ...bookingForm, dob: date })}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          <FormLabel component="legend">How do you identify yourself?</FormLabel>
          <div className={classes.genderContainer}>
            {Object.keys(genders).map((el, i) => {
              const label = el.charAt(0).toUpperCase() + el.slice(1)
              return (
                <FormControlLabel

                  control={<Checkbox
                    checked={genders[el]}
                    onChange={e => handleGenderChange(e)}
                    name={el} />}
                  label={label}
                />
              )
            })}

          </div>

          <FormControlLabel
            control={<Checkbox
              // checked={state.checkedA} 
              // onChange={handleChange} 
              name="checkedA" />}
            label="I agree to the Terms & Conditions"
          />



        </form>



      </DialogContent>

      <DialogActions>
        <Button onClick={e => handleBookingSubmit(e)}
          color="primary">
          Submit Booking
          </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseBookingDialogue;